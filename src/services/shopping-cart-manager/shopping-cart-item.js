"use strict";

import defaultsDeep from "lodash/defaultsDeep";

export default createShoppingCartItem;

const generateId = testEnvironment() ? generateIdSingle : generateIdConcat;

//======================================================================================================================
// CART ITEM
//======================================================================================================================

const SHOPPING_CART_ITEM_DEFAULTS = {
  id: generateId(),
  name: "undefined",
  text: undefined,
  price: 0,
  amount: 1,
  availability: true,
  propertyValues: [],
  instanceIds: [],
  error: undefined
};

function createShoppingCartItem(specification) {
  let {
    id,
    name,
    model,
    text,
    price,
    amount,
    availability,
    propertyValues,
    instanceIds,
    imageUrl
  } = specification;

  const item = defaultsDeep(
    {
      id,
      name: name || model.name,
      text,
      price: price ? Number.parseFloat(price) : undefined,
      amount,
      availability,
      model,
      propertyValues,
      instanceIds,
      imageUrl,

      get hashValue() {
        return calculateHashCode();
      },
      get totalPrice() {
        return calculateTotalPrice();
      }
    },
    SHOPPING_CART_ITEM_DEFAULTS
  );

  return item;

  //======================================================================================================================
  // HASH VALUE
  //======================================================================================================================

  function calculateHashCode() {
    let materialString = item.model.id || item.model;

    for (let propertyId in item.propertyValues) {
      materialString += propertyId + item.propertyValues[propertyId];
    }

    return hashFnv32a(materialString);
  }

  function calculateTotalPrice() {
    return item.availability ? item.price * item.amount : 0;
  }

  function hashFnv32a(str, seed) {
    var i,
      l,
      hval = seed === undefined ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
      hval ^= str.charCodeAt(i);
      hval +=
        (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    return hval >>> 0;
  }
}

//======================================================================================================================
// ID GENERATOR
//======================================================================================================================

function testEnvironment() {
  return (
    Math.random()
      .toString(36)
      .substring(2).length >= 16
  );
}

function generateIdSingle() {
  return Math.random()
    .toString(36)
    .substring(2, 18);
}

function generateIdConcat() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 10) +
    Math.random()
      .toString(36)
      .substring(2, 10)
  );
}
