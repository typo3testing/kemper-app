import createShoppingCartItem from "./shopping-cart-item";
import viewarApi from "viewar-api";

const shoppingCartManager = createShoppingCartManager(viewarApi);
export default shoppingCartManager;

//======================================================================================================================
// CART MANAGER
//======================================================================================================================

function createShoppingCartManager(viewarApi) {
  let items = [];
  let checkoutUrl = undefined;

  const { appUtils, sceneManager, modelManager } = viewarApi;

  const shoppingCartManager = {
    removeItem,
    clearItems,
    addModel,
    addScene,

    get items() {
      return items;
    },
    get checkoutUrl() {
      return checkoutUrl;
    },
    get totalPrice() {
      return items.reduce((total, item) => total + item.totalPrice, 0);
    },
    get totalAmount() {
      return items.reduce(
        (total, item) => total + (item.availability ? item.amount : 0),
        0
      );
    }
  };

  return shoppingCartManager;

  //======================================================================================================================
  // PUBLIC FUNCTIONS
  //======================================================================================================================

  function removeItem(item) {
    const index = items.indexOf(item);
    if (index > -1) {
      items.splice(index, 1);
    }
  }

  function clearItems() {
    items = [];
  }

  async function addModel(model, propertyValues, instanceId, parseUrl) {
    let modelId = model;
    if (typeof model === "object") {
      modelId = model.foreignKey || model.id;
    }

    if (parseUrl) {
      const sceneState = {
        children: [
          {
            // id: instanceId,
            model: modelId,
            propertyValues: propertyValues || {}
          }
        ]
      };
      const parsedData = await parseFromUrl(sceneState, parseUrl);
      checkoutUrl = parsedData.url;

      items = items.concat(parsedData.items);
    } else {
      const item = createShoppingCartItem({
        imageUrl: model.imageUrl,
        model: modelId,
        instanceIds: [instanceId],
        propertyValues
      });
      items.push(item);
    }
    filterItems();
    sortItems();
  }

  async function addScene(parseUrl) {
    if (parseUrl) {
      const sceneState = sceneManager.getSceneState();
      const parsedData = await parseFromUrl(sceneState, parseUrl);
      checkoutUrl = parsedData.url;

      items = items.concat(parsedData.items);
    } else {
      items = items.concat(getSceneItems());
    }
    filterItems();
    sortItems();
  }

  //======================================================================================================================
  // PRIVATE FUNCTIONS
  //======================================================================================================================

  function filterItems() {
    items = filterDuplicates(items);
  }

  function sortItems() {
    items = items.sort((a, b) => a.name.localeCompare(b.name));
  }

  //======================================================================================================================
  // GENERATE ITEMS FROM SCENE
  //======================================================================================================================

  function getSceneItems() {
    const instances = sceneManager.scene.children.filter(instance => {
      if (!instance.model) return false;

      // Filter ground confirmation model.
      if (
        instance.model.foreignKey === "floor_calibration" ||
        instance.model.foreignKey === "icon_ground_confirm"
      ) {
        return false;
      }

      // Filter room layout
      if (instance.model.name === "Roomlayout") {
        return false;
      }

      // Filter dummy and environment models.
      return !(
        ~instance.model.name.toLowerCase().indexOf("dummy") ||
        instance.model.type === "environment"
      );
    });

    return instances.map(instance =>
      createShoppingCartItem({
        imageUrl: instance.model.imageUrl,
        model: instance.model.foreignKey || instance.model.id,
        name: instance.model.name,
        instanceIds: [instance.id],
        propertyValues: getPropertyValues(instance)
      })
    );
  }

  function getPropertyValues(instance) {
    const propertyValues = {};
    const properties = instance.properties;

    for (let [name, value] of Object.entries(instance.propertyValues)) {
      if (properties[name].options.length > 1) {
        propertyValues[name] = value;
      }
    }

    return propertyValues;
  }

  function filterDuplicates(items) {
    return items.filter(function(item, index, items) {
      return items.every(function(otherItem) {
        if (item === otherItem) {
          return true;
        }

        if (otherItem.hashValue === item.hashValue) {
          if (otherItem.amount > 1) {
            otherItem.amount += item.amount;
            otherItem.instanceIds = otherItem.instanceIds.concat(
              item.instanceIds
            );
            item.amount = 0;
            return false;
          } else {
            item.amount += otherItem.amount;
            item.instanceIds = item.instanceIds.concat(otherItem.instanceIds);
            otherItem.amount = 0;
            return true;
          }
        } else {
          return true;
        }
      });
    });
  }

  //======================================================================================================================
  // GENERATE ITEMS FROM URL
  //======================================================================================================================

  async function parseFromUrl(sceneState, url) {
    let data = [];

    try {
      const params = {
        sceneState: JSON.stringify(sceneState)
      };
      data = await appUtils.httpPost(appUtils.getSecureUrl(url), params);
    } catch (e) {
      console.error(e.message);
    }

    let items = [];
    for (let id in data.items) {
      let {
        viewarId,
        availability,
        price,
        amount,
        name,
        instanceIds,
        propertyValues,
        error
      } = data.items[id];
      const model =
        modelManager.findModelByForeignKey(viewarId) ||
        modelManager.findModelById(viewarId);
      let item = createShoppingCartItem({
        name,
        imageUrl: model.imageUrl,
        model: viewarId,
        availability,
        price,
        amount,
        instanceIds,
        propertyValues,
        error
      });
      items.push(item);
    }

    return {
      url: data.url,
      items
    };
  }
}
