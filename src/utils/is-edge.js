import { branch, compose, renderComponent, withProps } from "recompose";
import globalStyles from "../../css/global.css";

const forceEdge = false; // for Debug

export const isEdgeBrowser =
  forceEdge || window.navigator.userAgent.includes("Edge");

/*
 renders a alternative component, if the browser is Microsoft Edge
 */
export const isEdge = component =>
  compose(
    withProps({
      isEdgeBrowser
    }),
    branch(({ isEdgeBrowser }) => isEdgeBrowser, renderComponent(component))
  );

export const getProperBackgroundClass = () =>
  isEdgeBrowser ? globalStyles.ButtonBarColorEdge : globalStyles.ButtonBarColor;
