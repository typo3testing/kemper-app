import test from "tape";
import "ignore-styles";

import {
  goUp,
  containsModels,
  insertModel,
  isRootCategory,
  openCategory,
  findModels,
  getCategory,
  getChildren,
  getInsertionPose,
  defaultPose
} from "./product-picker.js";

test("Product Picker - openCategory() adds a category to the stack ", assert => {
  assert.plan(1);

  const category = { name: "testCategory" };
  let stack = [];

  const setStack = value => (stack = value);

  openCategory({ stack, setStack, getChildren: () => category })(category);

  assert.deepEqual(stack[0], category);

  assert.end();
});

test("Product Picker - containsModels() returns true for a category with only models  ", assert => {
  assert.plan(1);

  const category = { children: [] };

  const result = containsModels({ getCategory: () => category })();

  assert.equal(result, true);

  assert.end();
});

test("Product Picker - containsModels() returns false for a category with nested categories  ", assert => {
  assert.plan(1);

  const category = { children: [{ children: [] }] };

  const result = containsModels({ getCategory: () => category })();

  assert.equal(result, false);

  assert.end();
});

test("Product Picker - isRootCategory() returns true for an stack of length 1  ", assert => {
  assert.plan(1);

  const stack = [{}];

  const result = isRootCategory({ stack })();

  assert.equal(result, true);

  assert.end();
});

test("Product Picker - isRootCategory() returns false for an stack more than 1  ", assert => {
  assert.plan(1);

  const stack = [{}, {}];

  const result = isRootCategory({ stack })();

  assert.equal(result, false);

  assert.end();
});

test("Product Picker - goUp() does not change the stack if already in root category  ", assert => {
  assert.plan(1);

  let stack = [{}];
  const clonedStack = [...stack];
  const isRootCategory = () => stack.length === 1;
  const setStack = () => {};

  goUp({ isRootCategory, stack, setStack })();

  assert.deepEqual(clonedStack, stack);

  assert.end();
});

test("Product Picker - goUp() removes the last entry of stack if not in root category  ", assert => {
  assert.plan(1);

  let stack = [{}, {}];
  const expectedStack = [{}];
  const isRootCategory = () => stack.length === 1;
  const setStack = value => (stack = value);

  goUp({ isRootCategory, stack, setStack })();

  assert.deepEqual(expectedStack, stack);

  assert.end();
});

test("Product Picker - getCategory() returns the last element in the stack", assert => {
  assert.plan(1);

  const stack = [{ name: "one" }, { name: "two" }];

  const result = getCategory({ stack })();

  assert.deepEqual(stack[stack.length - 1], result);

  assert.end();
});

//TODO test if findModels is actually using the root category
test("Product Picker - getCategory() returns new category of filtered models if a query is provided", assert => {
  assert.plan(1);

  const queryResultMock = [1, 2, 3];
  const stack = [{ name: "one" }, { name: "two" }];
  const query = "test";
  const findModels = () => queryResultMock;

  const result = getCategory({ stack, query, findModels })();

  assert.deepEqual(result, { children: queryResultMock });

  assert.end();
});

test("Product Picker - insertModel() calls toggleProductPicker", async assert => {
  assert.plan(1);

  const toggleProductPicker = () => assert.pass();
  const sceneManager = {
    insertModel: async () => {}
  };
  const setLoading = () => {};
  const zoomToFit = () => {};
  const getInsertionPose = async () => {};

  await insertModel({
    toggleProductPicker,
    sceneManager,
    setLoading,
    zoomToFit,
    getInsertionPose
  })();

  assert.end();
});

test("Product Picker - insertModel() calls insertModel with model as parameter", async assert => {
  assert.plan(1);

  const mockModel = { id: "1234" };

  const toggleProductPicker = () => {};
  const sceneManager = {
    insertModel: async model => assert.deepEqual(mockModel, model)
  };
  const setLoading = () => {};
  const zoomToFit = () => {};
  const getInsertionPose = async () => {};

  await insertModel({
    toggleProductPicker,
    sceneManager,
    setLoading,
    zoomToFit,
    getInsertionPose
  })(mockModel);

  assert.end();
});

test("Product Picker - insertModel() calls insertModel with pose as parameter", async assert => {
  assert.plan(1);

  const mockModel = { id: "1234" };

  const pose = {
    position: { x: 0, y: 0, z: 0 }
  };

  const toggleProductPicker = () => {};
  const sceneManager = {
    insertModel: async (model, args) => assert.deepEqual(args.pose, pose)
  };
  const setLoading = () => {};
  const zoomToFit = () => {};
  const getInsertionPose = async () => pose;

  await insertModel({
    toggleProductPicker,
    sceneManager,
    setLoading,
    zoomToFit,
    getInsertionPose
  })(mockModel);

  assert.end();
});

test("Product Picker - findModels() finds an expected number of models", assert => {
  assert.plan(1);

  const mockTree = {
    children: [
      {
        children: [
          {
            children: [{ name: "2findMe1" }, { name: "dont search for me" }]
          },
          {
            children: [{ foreignKey: "findMe" }]
          }
        ]
      },
      {}
    ]
  };

  const expectedLength = 2;

  const result = findModels(mockTree.children, "findMe");

  assert.equals(result.length, expectedLength);

  assert.end();
});

test("Product Picker - getInsertionPose() returns default pose if active camera is perspective camera", async assert => {
  assert.plan(1);

  const viewarApi = {
    init: async () => {},
    cameras: {
      perspectiveCamera: { active: true },
      augmentedRealityCamera: { active: false },
      walkCamera: { active: false }
    }
  };

  const result = await getInsertionPose({ viewarApi, defaultPose })();

  assert.equals(result, defaultPose);

  assert.end();
});

test("Product Picker - getInsertionPose() returns pose in viewing direction if augmented reality camera is active", async assert => {
  assert.plan(1);

  const poseInFront = {
    pose: { x: 200, y: 0, z: 200 }
  };

  const viewarApi = {
    init: async () => {},
    cameras: {
      perspectiveCamera: { active: false },
      augmentedRealityCamera: {
        active: true,
        getPoseInViewingDirection: async () => poseInFront
      },
      walkCamera: { active: false }
    }
  };

  const result = await getInsertionPose({ viewarApi, defaultPose })();

  assert.equals(result, poseInFront);

  assert.end();
});

test("Product Picker - getInsertionPose() returns pose in viewing direction if walk camera is active", async assert => {
  assert.plan(1);

  const poseInFront = {
    pose: { x: 200, y: 0, z: 200 }
  };

  const viewarApi = {
    init: async () => {},
    cameras: {
      perspectiveCamera: { active: false },
      walkCamera: {
        active: true,
        getPoseInViewingDirection: async () => poseInFront
      },
      augmentedRealityCamera: { active: false }
    }
  };

  const result = await getInsertionPose({ viewarApi, defaultPose })();

  assert.equals(result, poseInFront);

  assert.end();
});
