import test from "tape";
import "ignore-styles";

import { loadProject, deleteProject } from "./projects.js";
import { asyncNoop, noop } from "../../utils";

test("Projects - loadProject() calls service method loadProject with according project as parameter ", assert => {
  assert.plan(1);

  const mockProject = { id: "1234", info: {} };

  const history = {
    push: () => {}
  };

  const projectService = {
    loadProject: project => assert.deepEquals(project, mockProject)
  };

  loadProject({ history, projectService, setLoading: noop })(mockProject);

  assert.end();
});

test("Projects - loadProject() routes to freeze-frame view if activeCamera is AR", async assert => {
  assert.plan(1);

  const mockProject = { info: { activeCamera: "augmentedRealityCamera" } };

  const history = {
    push: route => assert.equals(route, "/freeze-frame")
  };

  const projectService = {
    loadProject: asyncNoop
  };

  await loadProject({ history, projectService, setLoading: noop })(mockProject);

  assert.end();
});

test("Projects - loadProject() routes to main view if activeCamera not AR", async assert => {
  assert.plan(1);

  const mockProject = { info: {} };

  const history = {
    push: route => assert.equals(route, "/main")
  };

  const projectService = {
    loadProject: () => {}
  };

  await loadProject({ history, projectService, setLoading: noop })(mockProject);

  assert.end();
});

test("Projects - deleteProject() calls service method deleteProject with according project as parameter ", async assert => {
  assert.plan(1);

  const mockProject = { id: "1234", info: {} };

  const setLocalProjects = () => {};

  const projectService = {
    get projects() {
      return { local: [] };
    },
    deleteProject: project => assert.deepEquals(project, mockProject)
  };

  await deleteProject({
    setLocalProjects,
    projectService,
    setLoading: noop,
    setSelectedProjectIndex: noop
  })(mockProject);

  assert.end();
});

test("Projects - deleteProject() updates local project index", async assert => {
  assert.plan(1);

  const mockProjects = { local: { a: {} } };

  const setLocalProjects = value =>
    assert.deepEqual(value, Object.values(mockProjects.local));

  const projectService = {
    deleteProject: () => {},
    get projects() {
      return mockProjects;
    }
  };

  await deleteProject({
    projectService,
    setLocalProjects,
    setLoading: noop,
    setSelectedProjectIndex: noop
  })(mockProjects.local.a);

  assert.end();
});
