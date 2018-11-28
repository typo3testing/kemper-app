import semver from "semver";
import viewarApi from "viewar-api";

import { VISUAL_MODELS } from "./constants";
import {
  getQuaternion,
  calculateAngle,
  length as vec3length,
  sub as vec3sub,
  scale as vec3scale
} from "./math/vector3";

export default createVisualManager;

function createVisualManager() {
  const { coreInterface, modelManager, sceneManager, versionInfo } = viewarApi;

  let models = {};
  let visuals = {};
  let currentWallPosition;

  const WALL_MODEL_SCALEFACTOR = 1 / 100;

  return {
    initModels,

    setCurrentWallPosition,
    setCurrentWallEndPosition,

    insertWall,
    removeLastWall,

    setWallHeight,

    setCurrentWallObjectPose,
    insertWallObject,
    displayWallObject,
    finishWallObject,
    removeLastWallObject,

    showClosingWall,
    hideClosingWall,

    clearVisuals,

    show,
    hide,
    removeAll,
    getTargetPosition
  };

  //======================================================================================================================
  // PUBLIC FUNCTIONS
  //======================================================================================================================

  async function initModels(progressListener) {
    const count = {
      total: Object.keys(VISUAL_MODELS).length,
      current: 0
    };

    const updateProgress = (id, progress) => {
      if (!isNaN(parseFloat(progress))) {
        const totalProgress =
          (count.current / count.total + (1 / count.total) * (progress / 100)) *
          100;
        progressListener && progressListener(totalProgress);
      }
    };

    modelManager.on("transferProgress", updateProgress);
    for (let type in VISUAL_MODELS) {
      progressListener && progressListener((count.current / count.total) * 100);
      models[type] = models[type] || (await prepareModel(VISUAL_MODELS[type]));
      count.current++;
    }
    progressListener && progressListener(100);
    modelManager.off("transferProgress", updateProgress);

    setTimeout(
      async () =>
        (visuals["closingwall"] = await insertVisualization(
          models["ground"],
          {},
          false
        )),
      5000
    ); // Core bug: 'ground' or 'ground_stretched' is invisible if inserted at once.
    visuals["plane"] = await insertVisualization(models["plane"], {}, false);
    visuals["target"] = await insertVisualization(models["target"], {});
    visuals["lastedge"] = await insertVisualization(
      models["lastedge"],
      {},
      false
    );
    visuals["currentwall"] = await insertVisualization(
      models["ground_stretched"],
      {},
      false
    );
    visuals["currentwallobject"] = await insertVisualization(
      models["wallobject_stretched"],
      {},
      false
    );
    visuals["closingwalltarget"] = await insertVisualization(
      models["target_fixed"],
      {},
      false
    );

    // select target, so the pose gets updated every frame for getTargetPosition method
    await sceneManager.select(visuals["target"]);
  }

  async function showClosingWall(p1, p2) {
    const rotationY = getQuaternion(
      { x: 0, y: 1, z: 0 },
      -calculateAngle(p1, p2, "y")
    );
    const length = vec3length(vec3sub(p2, p1));

    const pose = {
      position: p1,
      orientation: rotationY,
      scale: vec3scale({ x: length, y: 0, z: 10 }, WALL_MODEL_SCALEFACTOR)
    };

    await show("closingwall", pose);
    await show("closingwalltarget", { position: p2 });
  }

  async function hideClosingWall() {
    await hide("closingwall");
    await hide("closingwalltarget");
  }

  async function setCurrentWallPosition(position) {
    currentWallPosition = position;

    const pose = {
      position,
      scale: vec3scale({ x: 1, y: 0, z: 10 }, WALL_MODEL_SCALEFACTOR)
    };
    await show("currentwall", pose);
  }

  async function setCurrentWallEndPosition(p2) {
    const p1 = currentWallPosition || visuals["currentwall"].pose.position;
    const rotationY = getQuaternion(
      { x: 0, y: 1, z: 0 },
      -calculateAngle(p1, p2, "y")
    );
    const length = vec3length(vec3sub(p2, p1));

    const pose = {
      position: p1,
      orientation: rotationY,
      scale: vec3scale({ x: length, y: 0, z: 10 }, WALL_MODEL_SCALEFACTOR)
    };

    await visuals["currentwall"].setPose(pose);

    return length;
  }

  async function setCurrentWallObjectPose({ position, orientation }) {
    currentWallPosition = position;

    const pose = {
      position,
      orientation,
      scale: { x: 1, y: 1, z: 0.001 }
    };
    await show("currentwallobject", pose);
  }

  async function insertWall(p1, p2) {
    const rotationY = getQuaternion(
      { x: 0, y: 1, z: 0 },
      -calculateAngle(p1, p2, "y")
    );
    const length = vec3length(vec3sub(p2, p1));

    const pose = {
      position: p1,
      orientation: rotationY,
      scale: vec3scale({ x: length, y: 0, z: 10 }, WALL_MODEL_SCALEFACTOR)
    };
    const wall = await insertVisualization(models["wall"], pose);
    const floor = await insertVisualization(models["ground"], pose);

    if (!visuals["wall"]) {
      visuals["wall"] = [];
    }

    visuals["wall"].push([wall, floor]);
  }

  async function removeLastWall() {
    await removeLastVisual("wall");
  }

  async function setWallHeight(height) {
    if (visuals["wall"]) {
      for (let wall of visuals["wall"]) {
        const pose = wall[0].pose;
        wall[0].setPose({
          scale: {
            x: pose.scale.x,
            y: height * WALL_MODEL_SCALEFACTOR,
            z: pose.scale.z
          }
        });
      }
    }
  }

  async function insertWallObject(bottomLeft, topRight) {
    const bottomRight = {
      x: topRight.x,
      y: bottomLeft.y,
      z: topRight.z
    };
    const topLeft = {
      x: bottomLeft.x,
      y: topRight.y,
      z: bottomLeft.z
    };
    const width = vec3length(vec3sub(bottomRight, bottomLeft));
    const height = vec3length(vec3sub(topLeft, bottomLeft));
    const rotationY = getQuaternion(
      { x: 0, y: 1, z: 0 },
      -calculateAngle(bottomLeft, bottomRight, "y")
    );

    const visualization = await insertVisualization(models["wallobject"], {
      position: bottomLeft,
      orientation: rotationY,
      scale: { x: width / 1000, y: height / 1000, z: 0.001 }
    });

    if (!visuals["wallobject"]) {
      visuals["wallobject"] = [];
    }

    visuals["wallobject"].push(visualization);
  }

  // TODO: Refactor: Deprecated, remove after core update.
  async function displayWallObject(pose) {
    const visualization = await insertVisualization(models["wallobject"], pose);
    if (!visuals["wallobject"]) {
      visuals["wallobject"] = [];
    }

    visuals["wallobject"].push(visualization);
  }

  // TODO: Refactor: Deprecated, remove after core update.
  async function finishWallObject(bottomLeft, topRight) {
    if (visuals["wallobject"] && visuals["wallobject"].length) {
      const bottomRight = {
        x: topRight.x,
        y: bottomLeft.y,
        z: topRight.z
      };
      const topLeft = {
        x: bottomLeft.x,
        y: topRight.y,
        z: bottomLeft.z
      };
      const width = vec3length(vec3sub(bottomRight, bottomLeft));
      const height = vec3length(vec3sub(topLeft, bottomLeft));
      const rotationY = getQuaternion(
        { x: 0, y: 1, z: 0 },
        -calculateAngle(bottomLeft, bottomRight, "y")
      );

      const instance = visuals["wallobject"][visuals["wallobject"].length - 1];
      await instance.setPose({
        orientation: rotationY,
        scale: { x: width / 1000, y: height / 1000, z: 0.001 }
      });
    }
  }

  async function removeLastWallObject() {
    await removeLastVisual("wallobject");
  }

  async function clearVisuals() {
    for (let type in visuals) {
      if (visuals[type]) {
        await removeRecursive(visuals[type]);
      }
    }
    visuals = {};
  }

  async function show(type, pose) {
    if (visuals[type]) {
      pose && (await visuals[type].setPose(pose));
      await visuals[type].setVisible(true);
    }
  }

  async function hide(type) {
    if (visuals[type]) {
      await visuals[type].setVisible(false);
    }
  }

  async function removeAll(type) {
    if (visuals[type]) {
      await removeRecursive(visuals[type]);
    }
  }

  async function getTargetPosition() {
    if (visuals["target"]) {
      if (semver.satisfies(versionInfo.core, "^11.0.0")) {
        return visuals["target"].pose.position;
      } else {
        const pose = await coreInterface.call(
          "getInstancePose",
          visuals["target"].id
        );
        return pose.position;
      }
    }
  }

  //======================================================================================================================
  // PRIVATE FUNCTIONS
  //======================================================================================================================

  async function prepareModel({ foreignKey, modelId }) {
    let model;
    if (foreignKey) {
      model = modelManager.findModelByForeignKey(foreignKey);
    }

    if (!model && modelId) {
      model = await modelManager.getModelFromRepository(modelId);
    }

    if (!model) {
      throw new Error(
        `Visualization with foreign key "${foreignKey} or model id "${modelId}" not found.`
      );
    }

    // Update deletes description, so already downloaded models fail to download
    // await model.update()
    await model.download();
    return model;
  }

  async function removeLastVisual(type) {
    if (visuals[type] && visuals[type].length) {
      await removeRecursive(visuals[type][visuals[type].length - 1]);
      visuals[type].splice(visuals[type].length - 1, 1);
    }
  }

  async function removeRecursive(node) {
    if (Array.isArray(node)) {
      for (let child of node) {
        await removeRecursive(child);
      }
    } else {
      sceneManager.removeNode(node);
    }
  }

  async function insertVisualization(model, pose, visible = true) {
    if (model) {
      const visualization = await sceneManager.insertModel(model, {
        pose,
        visible
      });
      await visualization.setVisible(visible);

      return visualization;
    }
  }
}
