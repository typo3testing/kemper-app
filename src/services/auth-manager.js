import viewarApi from "viewar-api";
import appState from "./app-state";

const createAuthManager = () => {
  const persistLogin = async () => {
    const { storage } = viewarApi;
    const settings = await storage.local.write("settings.json", {
      authKey: appState.authKey
    });
  };

  const readPersisted = async () => {
    const { storage, authenticationManager, projectManager } = viewarApi;
    const settings = (await storage.local.read("settings.json")) || {};

    let authKey = settings.authKey;
    authenticationManager.logIn(authKey);
    await projectManager.updateCloudIndex();

    Object.assign(appState, {
      authKey
    });
  };

  const login = async (username, password) => {
    const { authenticationManager, projectManager } = viewarApi;

    authenticationManager.logIn(username, password);
    await projectManager.updateCloudIndex();

    Object.assign(appState, {
      authKey: authenticationManager.token
    });

    await persistLogin();
  };

  return {
    login,
    readPersisted
  };
};

export default createAuthManager();
