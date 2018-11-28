export function createProjects({
  saveScreenshot,
  getActiveCameraName,
  activateCamera,
  getActiveTracker,
  saveTrackerFeatureSet,
  loadTrackerFeatureSet,
  unloadTrackerFeatureSet,
  activatePerspectiveCamera,
  getSelection,
  takeFreezeFrame,
  loadFreezeFrame,
  getRoomEditorState,
  createNewProject,
  logEvent,
  importRoomState,
  updateProjectIndex,
  selectInstance,
  getProjects,
  trackerNeedsInitialization,
  uploadFreezeFrames
}) {
  let activeProject = null;

  return {
    saveProject,
    saveCloudProject,
    loadProject,
    loadFeatureSet,
    unloadProject,
    deleteProject,
    uploadProject,
    downloadProject,

    get projects() {
      return getProjects();
    },
    get activeProject() {
      return activeProject;
    }
  };

  //----------------------------------------------------------------------------------------------------------------------
  // Public Methods
  //----------------------------------------------------------------------------------------------------------------------

  /**
   * Saves or updates a new project and sets it to active.
   *
   * @param projectName Name of the project to save.
   * @param project If passed, the existing project's name will be updated instead of creating a new project.
   * @param switchToPerspective Flag if function should switch to perspective camera (Used for projects after capturing room)
   */
  async function saveProject(
    projectName = Math.random()
      .toString(36)
      .substring(7),
    project,
    switchToPerspective = false
  ) {
    if (!project) {
      const newProject = await createProjectInfo(
        projectName,
        switchToPerspective
      );
      await newProject.storeLocally();
    } else {
      project.name = projectName;
    }

    activeProject = project;
    logEvent("project", "save", projectName);
  }

  /**
   * Saves or updates a new cloud project and sets it to active.
   *
   * @param projectName Name of the project to save.
   * @param project If passed, the existing project's name will be updated instead of creating a new project.
   * @param switchToPerspective Flag if function should switch to perspective camera (Used for projects after capturing room)
   */
  async function saveCloudProject(
    projectName = Math.random()
      .toString(36)
      .substring(7),
    project,
    switchToPerspective = false
  ) {
    if (!project) {
      const newProject = await createProjectInfo(
        projectName,
        switchToPerspective
      );
      await newProject.storeToCloud();
    } else {
      project.name = projectName;
    }

    activeProject = project;
    logEvent("project", "save", projectName);
  }

  /**
   * Loads a specific project. If a freeze frame is chosen, the tracker's feature set won't be loaded.
   *
   * @param project The project to load.
   * @param freezeFrame Either a boolean (true: load first freeze frame), a number (index of freeze frame in list)
   *                    or a string with the freeze frame's name. On default no freeze frame is loaded.
   * @returns {boolean} True if a calibration step is needed for the loaded tracker.
   */
  async function loadProject(project, freezeFrame = false) {
    let trackerNeedsCalibration = false;

    try {
      await project.loadState();
      importRoomState(project.info.roomEditorState);

      await activateCamera(project.info.activeCamera);

      const freezeFrameLoaded = await loadProjectFreezeFrame(
        project,
        freezeFrame
      );
      if (!freezeFrameLoaded) {
        trackerNeedsCalibration = trackerNeedsInitialization(project.info);
      }

      await selectInstance(project.info.selection);
      activeProject = project;
      logEvent("project", "load", project.name);
    } catch (exception) {
      console.error("Error in loadProject: " + exception.message);
    }

    return trackerNeedsCalibration;
  }

  async function loadFeatureSet() {
    activeProject && (await loadTrackerFeatureSet(activeProject.info));
  }

  /**
   * Unloads the tracker's feature set of a project.
   *
   * @param project The project to unload. If nothing given, the active project get's unloaded.
   */
  async function unloadProject(project) {
    if (project) {
      await unloadTrackerFeatureSet(project.info);
      if (project === activeProject) {
        activeProject = null;
      }
    } else if (activeProject) {
      await unloadTrackerFeatureSet(activeProject.info);
      activeProject = null;
    }
  }

  /**
   * Deletes a project either from cloud or locally.
   *
   * @param project The project to delete.
   * @param isCloudProject Delete from cloud or locally.
   */
  async function deleteProject(project, isCloudProject) {
    try {
      isCloudProject
        ? await project.removeFromCloud()
        : await project.removeLocally();
      await updateProjectIndex();
      logEvent("project", "delete", project.name);
    } catch (exception) {
      console.error("Error in deleteProject: " + exception.message);
    }
  }

  async function uploadProject(project) {
    try {
      await project.storeToCloud();
      await uploadFreezeFrames(project.info.freezeFrames);
      await updateProjectIndex();
      logEvent("project", "upload", project.name);
    } catch (exception) {
      console.error("Error in uploadProject: " + exception.message);
    }
  }

  async function downloadProject(project) {
    try {
      await project.storeLocally();
      await updateProjectIndex();
      logEvent("project", "download", project.name);
    } catch (exception) {
      console.error("Error in downloadProject: " + exception.message);
    }
  }

  //----------------------------------------------------------------------------------------------------------------------
  // Private Methods
  //----------------------------------------------------------------------------------------------------------------------

  /**
   * Loads a freeze frame from a project (called by loadProject).
   *
   * @param project The project which contains the freeze frame.
   * @param freezeFrame Either a boolean (true: load first freeze frame), a number (index of freeze frame in list)
   *                    or a string with the freeze frame's name.
   * @returns {boolean} True if freeze frame was loaded.
   */
  async function loadProjectFreezeFrame(project, freezeFrame) {
    if (
      project.info.freezeFrames &&
      project.info.freezeFrames.length &&
      (freezeFrame || freezeFrame === 0)
    ) {
      let freezeFrameName = project.info.freezeFrames[0];
      if (typeof freezeFrame === "number") {
        if (freezeFrame >= project.info.freezeFrames.length) {
          freezeFrameName = project.info.freezeFrames[freezeFrame].name;
        }
      } else if (typeof freezeFrame === "string") {
        freezeFrameName = freezeFrame;
      } else {
        freezeFrameName = project.info.freezeFrames[0].name;
      }

      await loadFreezeFrame(freezeFrameName);
      return true;
    }

    return false;
  }

  /**
   * Collects all necessary information from the current scene:
   *   - scene state
   *   - active camera
   *   - freeze frame (if AR camera is active)
   *   - screenshot
   *   - active tracker
   *   - active tracker's featureset
   *   - room editor state
   *
   * and creates a new project (ViewAR api).
   *
   * @param projectName Name of the project.
   * @param switchToPerspective Flag if function should switch to perspective camera (Used for projects after capturing room).
   * @returns {*} The new project.
   */
  async function createProjectInfo(projectName, switchToPerspective) {
    if (switchToPerspective) {
      await activatePerspectiveCamera();
    }

    const url = await saveScreenshot();

    const activeCameraName = getActiveCameraName();
    let info = {
      images: [url],
      activeCamera: activeCameraName,
      selection: getSelection(),
      roomEditorState: getRoomEditorState()
    };

    if (activeCameraName === "arCamera") {
      info.freezeFrames = [await takeFreezeFrame()];
      const activeTracker = getActiveTracker();
      if (activeTracker) {
        info.tracker = activeTracker.name;
        info.featureSet = await saveTrackerFeatureSet(
          activeTracker,
          projectName
        );
      }
    }

    const project = createNewProject({ name: projectName, info });
    project.saveState(url);

    return project;
  }
}
