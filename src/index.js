import React from "react";
import ReactDOM from "react-dom";
import merge from "lodash/merge";
import { AppContainer } from "react-hot-loader";
import { IntlProvider } from "react-intl";

import viewarApi from "viewar-api";
import projects from "./services/projects";
import appState from "./services/app-state";
import googleAnalytics from "./services/google-analytics/index";
import shoppingCartManager from "./services/shopping-cart-manager/shopping-cart-manager";
import authManager from "./services/auth-manager";
import roomCapture from "./services/room-capturing";
import config from "./config";
import { translationProvider, roomPlanner } from "./services/index";

import App from "./app";

import "../css/weather.css";
import "../css/global.css";

(async function() {
  const api = (window.api = await viewarApi.init({ logToScreen: true }));
  merge(config, api.appConfig.uiConfig);

  await googleAnalytics.init();
  translationProvider.init();

  document.body.classList.add("global-CustomFont1");

  Object.assign(window, {
    config,
    projects,
    googleAnalytics,
    translationProvider,
    roomPlanner,
    roomCapture,
    shoppingCartManager,
    authManager,
    appState
  });

  const rootElement =
    document.getElementById("app-root") || document.getElementById("app");

  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <IntlProvider
          locale={translationProvider.language}
          key={translationProvider.language}
        >
          <Component />
        </IntlProvider>
      </AppContainer>,
      rootElement
    );
  };

  render(App);

  if (module.hot) {
    module.hot.accept("./app", () => render(App));
  }
})();
