import { withRouter } from "react-router";
import {
  compose,
  withHandlers,
  withProps,
  withState,
  toClass
} from "recompose";

import viewarApi from "viewar-api";

import appState from "../../services/app-state";
import authManager from "../../services/auth-manager";
import projectService from "../../services/projects";
import { withDialogControls } from "../../services/dialog";
import { withSetLoading } from "../../services/loading";
import { getUiConfigPath } from "../../utils";

import Projects from "./projects.jsx";

export const deleteProject = ({
  projectService,
  setProjects,
  setLoading,
  showDialog,
  type
}) => async project => {
  const result = await showDialog("ProjectsDelete", {
    showCancel: true,
    confirmText: "DialogYes",
    cancelText: "DialogNo"
  });

  if (result.confirmed) {
    setLoading(true);
    await projectService.deleteProject(project, type === "cloud");
    setLoading(false);
    setProjects({
      local: Object.values(projectService.projects.local).sort(
        sortByTimestampDesc
      ),
      cloud: Object.values(projectService.projects.cloud).sort(
        sortByTimestampDesc
      )
    });
  }
};

export const loadProject = ({
  showDialog,
  history,
  projectService,
  setLoading,
  viewarApi
}) => async project => {
  let loadFreezeFrame = false;
  if (project.info.activeCamera === "arCamera") {
    if (
      project.info.featureSet &&
      Object.keys(project.info.featureSet).length
    ) {
      const result = await showDialog("ProjectsLoadFreezeFrame", {
        showCancel: true,
        confirmText: "ProjectsFreezeFrame",
        cancelText: "ProjectsTracking"
      });
      loadFreezeFrame = !!result.confirmed;
    } else {
      loadFreezeFrame = true;
    }
  }

  setLoading(true);
  const trackerNeedsCalibration = await projectService.loadProject(
    project,
    loadFreezeFrame
  );
  setLoading(false);

  let route = "view-selection";
  if (project.info.activeCamera === "arCamera") {
    route = trackerNeedsCalibration ? "/calibration-main" : "/freeze-frame";
  }

  history.push(route);
};

export const getProjectImage = ({ viewarApi }) => project =>
  viewarApi.coreInterface.resolveUrl(project.localScreenshotUrl) ||
  project.screenshotUrl;

export const sortByTimestampDesc = (a, b) => a.timestamp < b.timestamp;

export const toggleType = ({
  appState,
  showAuthDialog,
  type,
  setType,
  updateProjectList
}) => async () => {
  let newType = type === "local" ? "cloud" : "local";
  setType(newType);

  if (newType === "cloud") {
    let loggedIn = appState.authKey;

    // Log in first
    if (!loggedIn) {
      await showAuthDialog();
    }

    updateProjectList();
  }
};

export const showAuthDialog = ({
  showDialog,
  appState,
  setUser,
  authManager
}) => async () => {
  const { confirmed, input } = await showDialog("DialogEnterEmail", {
    input: appState.authKey,
    withInput: true,
    showCancel: true
  });

  if (confirmed && input) {
    await authManager.login(input);
    setUser(appState.authKey);
    return true;
  }

  return false;
};

export const updateProjectList = ({
  setProjects,
  projectService,
  sortByDate
}) => () => {
  setProjects({
    local: Object.values(projectService.projects.local).sort(
      sortByTimestampDesc
    ),
    cloud: Object.values(projectService.projects.cloud).sort(
      sortByTimestampDesc
    )
  });
};

export const uploadProject = ({
  projectService,
  setLoading,
  updateProjectList
}) => async project => {
  setLoading(true);
  await projectService.uploadProject(project);
  updateProjectList();
  setLoading(false);
};

export const downloadProject = ({
  projectService,
  setLoading,
  updateProjectList
}) => async project => {
  setLoading(true);
  await projectService.downloadProject(project);
  updateProjectList();
  setLoading(false);
};

export default compose(
  toClass,
  withRouter,
  withSetLoading,
  withDialogControls,
  withProps({
    projectService,
    sortByTimestampDesc,
    viewarApi,
    authManager,
    appState,
    getUiConfigPath
  }),
  withState("type", "setType", "local"),
  withState("user", "setUser", ({ appState }) => appState.authKey),
  withState("projects", "setProjects", ({ projectService, sortByDate }) => ({
    local: Object.values(projectService.projects.local).sort(
      sortByTimestampDesc
    ),
    cloud: Object.values(projectService.projects.cloud).sort(
      sortByTimestampDesc
    )
  })),
  withState("selectedProjectIndex", "setSelectedProjectIndex", 0),
  withState("slider", "setSlider", null),
  withProps(({ getUiConfigPath }) => ({
    cloudProjectsEnabled: getUiConfigPath("cloudProjects")
  })),
  withHandlers({
    showAuthDialog
  }),
  withHandlers({
    updateProjectList
  }),
  withHandlers({
    toggleType,
    getProjectImage,
    deleteProject,
    loadProject,
    uploadProject,
    downloadProject
  })
)(Projects);
