import pubSub from "./pub-sub";
import viewarApi from "viewar-api";

export default createSceneListener(viewarApi);

//======================================================================================================================
// ROOM CAPTURING
//======================================================================================================================

function createSceneListener({
  cameras,
  coreInterface,
  modelManager,
  trackers,
  sceneManager
}) {
  let interval;
  let lastSceneState;

  return {
    startListening,
    stopListening,
    on: pubSub.subscribe,
    isListening: !!interval
  };

  //======================================================================================================================
  // PUBLIC FUNCTIONS
  //======================================================================================================================

  async function startListening(rate = 1000) {
    if (interval) throw new Error("already listening");
    interval = setInterval(hasStateChanged, rate);
  }

  async function stopListening() {
    clearInterval(interval);
    interval = null;
    pubSub.unsubscribe("sceneStateUpdate");
  }

  //======================================================================================================================
  // PRIVATE FUNCTIONS
  //======================================================================================================================

  async function hasStateChanged() {
    const sceneState = await sceneManager.getSceneStateSafe();
    if (JSON.stringify(sceneState) !== JSON.stringify(lastSceneState)) {
      pubSub.publish("sceneStateUpdate", sceneState);
      lastSceneState = sceneState;
    }
  }
}
