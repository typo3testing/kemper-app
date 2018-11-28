import test from "tape";

import { generateReport } from "./shopping-cart";
import { asyncNoop, noop } from "../../utils";

test("ShoppingCart - generateReport() clears existing shopping cart and adds scene", async assert => {
  assert.plan(1);

  const getShoppingCartManager = async () => ({
    clearItems: () => assert.pass(),
    addScene: asyncNoop
  });

  await generateReport({
    getShoppingCartManager,
    setLoading: noop,
    setItems: noop,
    setSum: noop
  })();

  assert.end();
});

test("ShoppingCart - generateReport() adds the scene to the shopping cart", async assert => {
  assert.plan(1);

  const getShoppingCartManager = async () => ({
    clearItems: () => assert.pass(),
    addScene: asyncNoop
  });

  await generateReport({
    getShoppingCartManager,
    setLoading: noop,
    setItems: noop,
    setSum: noop
  })();

  assert.end();
});

test("ShoppingCart - generateReport() passes parseUrl when adding scene", async assert => {
  assert.plan(1);

  const parseUrl = "url";
  const getShoppingCartManager = async () => ({
    clearItems: noop,
    addScene: async url => assert.equals(url, parseUrl)
  });

  await generateReport({
    getShoppingCartManager,
    setLoading: noop,
    setItems: noop,
    setSum: noop,
    parseUrl
  })();

  assert.end();
});
