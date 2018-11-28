import viewarApi from "viewar-api";

export const getActiveTracker = () => {
  const { trackers } = viewarApi;
  const activeTracker = Object.values(trackers).filter(
    tracker => tracker.active
  );
  return activeTracker.length ? activeTracker[0] : null;
};

export const saveTrackerFeatureSet = async (tracker, projectName) => {
  if (tracker.saveTrackingMap) {
    const mapName = await tracker.saveTrackingMap();

    return {
      trackingMap: mapName
    };
  } else if (tracker.name === "ARKit") {
    const qrCodes = await getLearnedQrCodes();

    if (qrCodes) {
      return {
        qrCodes
      };
    }
  }

  return null;
};

export const loadTrackerFeatureSet = async ({
  tracker: trackerName,
  featureSet
}) => {
  const { trackers } = viewarApi;

  if (featureSet) {
    const tracker = trackers[trackerName];

    if (tracker) {
      if (featureSet.trackingMap) {
        tracker.loadTrackingMap &&
          (await tracker.loadTrackingMap(featureSet.trackingMap));
      } else if (featureSet.qrCodes) {
        await setCustomTrackingTargets(featureSet.qrCodes);
      }
    }
  }
};

export const trackerNeedsInitialization = async ({ featureSet }) =>
  featureSet && (featureSet.qrCodes || featureSet.trackingMap);

export const unloadTrackerFeatureSet = async ({
  tracker: trackerName,
  featureSet
}) => {
  const { trackers } = viewarApi;
  if (featureSet) {
    const tracker = trackers[trackerName];
    if (tracker) {
      switch (tracker.name) {
        case "Placenote":
          // Do nothing, reset alone is sufficient to reset tracking map.
          break;
        case "ARKit":
          await setOriginalTrackingTargets();
          break;
      }
    }
  }
};

export const getLearnedQrCodes = async () => {
  const { coreInterface } = viewarApi;
  let qrCodes =
    coreInterface.platform === "iOS"
      ? await coreInterface.call(
          "customTrackingCommand",
          "ARKit",
          "getLearnedTargets",
          ""
        )
      : [];

  qrCodes = qrCodes.filter(
    ({
      pose: {
        position: { x, y, z }
      }
    }) => x && y && z
  );
  if (!qrCodes.length) {
    return undefined;
  } else {
    return qrCodes;
  }
};

export const setCustomTrackingTargets = async qrCodes => {
  const { appConfig, coreInterface } = viewarApi;
  const { trackerList } = appConfig;

  const customTrackingConfig = JSON.parse(JSON.stringify(trackerList));
  const customTracker = customTrackingConfig.find(
    tracker => tracker.name === "ARKit"
  );

  if (customTracker) {
    for (let qrCode of qrCodes) {
      const target = customTracker.targets.find(
        target => target.name === qrCode.name
      );
      if (target) {
        target.pose = qrCode.pose;
        target.learn = false;
      }
    }

    return await coreInterface.call(
      "setTrackingTargets",
      "ARKit",
      customTracker.targets
    );
  }
};

export const setOriginalTrackingTargets = async () => {
  const { appConfig, coreInterface } = viewarApi;
  const tracker = appConfig.trackerList.find(
    tracker => tracker.name === "ARKit"
  );
  if (tracker) {
    return await coreInterface.call(
      "setTrackingTargets",
      "ARKit",
      tracker.targets
    );
  }
};
