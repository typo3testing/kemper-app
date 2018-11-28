import {
  compose,
  lifecycle,
  withProps,
  withHandlers,
  withState,
  withPropsOnChange
} from "recompose";

import viewarApi from "viewar-api";
import { withSetLoading } from "../../services/loading";
import shoppingCartManager from "../../services/shopping-cart-manager/shopping-cart-manager";
import { getUiConfigPath } from "../../utils";

import ShoppingCart from "./shopping-cart.jsx";

export const generateReport = ({
  shoppingCartManager,
  setLoading,
  setItems,
  setSum,
  parseUrl
}) => async () => {
  setLoading(true);

  shoppingCartManager.clearItems();
  await shoppingCartManager.addScene(parseUrl);

  setItems(shoppingCartManager.items);
  setSum(shoppingCartManager.totalPrice);

  setLoading(false);
};

export const duplicateInstance = ({ viewarApi }) => async instance => {
  const { sceneManager } = viewarApi;

  let newPose = instance.pose;
  newPose.position.x += 500;
  newPose.position.z += 500;

  let newInstance = await sceneManager.insertModel(instance.model, {
    pose: newPose,
    propertyValues: instance.propertyValues
  });

  await sceneManager.select(newInstance);
};

export const increaseItemAmount = ({
  shoppingCartManager,
  setLoading,
  generateReport,
  viewarApi,
  duplicateInstance
}) => async item => {
  setLoading(true);
  const { sceneManager } = viewarApi;
  const instance = sceneManager.findNodeById(
    item.instanceIds[item.instanceIds.length - 1]
  );

  await duplicateInstance(instance);

  setLoading(false);
  generateReport();
};

export const decreaseItemAmount = ({
  shoppingCartManager,
  generateReport,
  viewarApi
}) => async item => {
  if (item.instanceIds.length) {
    const { sceneManager } = viewarApi;
    const instance = sceneManager.findNodeById(
      item.instanceIds.splice(item.instanceIds.length - 1, 1)[0]
    );
    await sceneManager.removeNode(instance);
  }

  generateReport();
};

export const checkout = ({
  shoppingCartManager,
  viewarApi: { appUtils }
}) => () =>
  appUtils.openUrl(appUtils.getSecureUrl(shoppingCartManager.checkoutUrl));

export default compose(
  withSetLoading,
  withState("sum", "setSum", 0),
  withState("items", "setItems", []),
  withProps({
    shoppingCartManager,
    viewarApi,
    getUiConfigPath
  }),
  withProps(({ getUiConfigPath }) => ({
    parseUrl: getUiConfigPath("checkoutUrl"),
    shareEnabled: getUiConfigPath("share")
  })),
  withProps(({ shareEnabled }) => ({
    gapPosition: shareEnabled ? 3 : 2
  })),
  withHandlers({
    generateReport,
    duplicateInstance,
    checkout
  }),
  withHandlers({
    increaseItemAmount,
    decreaseItemAmount
  }),
  withPropsOnChange(
    ["hidden"],
    ({ generateReport, hidden }) => !hidden && generateReport()
  )
)(ShoppingCart);
