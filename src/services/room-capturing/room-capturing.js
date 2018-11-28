// TODO: Delete this file.

/*
import semver from 'semver'
import viewarApi from 'viewar-api'
import createStateMachine, { STATE_STOPPED, STATE_EDGE, STATE_WINDOW, STATE_DOOR, STATE_ROOMHEIGHT } from './states'

import { getCurrentRoomState } from './room-state-export'
import createVisualManager from './visual-manager'
import { getRayFromPose, getPlaneIntersections } from './math/math'
import { CURRENT_EDGE_UPDATE_INTERVAL, HEIGHT_UPDATE_INTERVAL, WALL_HEIGHT, OBJECT_MODELS } from './constants'
import { length as vec3length, sub as vec3sub } from './math/vector3'
import { capitalizeFirstLetter } from './utils'

export default createRoomCapturing(viewarApi)

//======================================================================================================================
// ROOM CAPTURING
//======================================================================================================================

export function createRoomCapturing ({cameras, coreInterface, modelManager, trackers, sceneManager, versionInfo}) {

  // TODO: Refactor: Deprecated, remove after core update.
  let CORE_HAS_CAMERASTRETCHBEHAVIOR = false


  const stateMachine = createStateMachine()
  const camera = cameras.augmentedRealityCamera
  let tracker = null

  let roomHeight = null
  let state = STATE_STOPPED
  let edges = []
  let doors = []
  let objects = {
    door: [],
    window: []
  }
  let currentEdge = false
  let currentObject = null
  let heightUpdate = 0
  let edgeUpdate = 0
  let currentHeight = 0
  let currentLength = 0
  let hasRoomState = false
  let objectModels = null
  let listener = {}

  const visuals = createVisualManager({coreInterface, modelManager, sceneManager, versionInfo})

  const roomCapturing = {
    resetRoomState,
    startCapture,
    setCaptureType,
    stopCapture,
    finishCapture,
    capturePoint,
    undo,

    on,
    off,

    testInternalState: (internalState) => {
      return getCurrentRoomState(internalState)
    },

    get roomState () {
      return hasRoomState && getCurrentRoomState(getInternalState())
    },

    get internalState () {
      return getInternalState()
    },
  }

  window.roomCapturing = roomCapturing
  return roomCapturing

//======================================================================================================================
// PUBLIC FUNCTIONS
//======================================================================================================================

  async function startCapture (progressListener) {
    initTracking()
    await initObjectModels()
    resetInternalState()
    state = STATE_EDGE

    CORE_HAS_CAMERASTRETCHBEHAVIOR = semver.satisfies(versionInfo.core, '^11.1.0')
    await visuals.initModels(CORE_HAS_CAMERASTRETCHBEHAVIOR, progressListener)

    updateStatus()
  }

  async function setCaptureType (type) {
    if (state === STATE_EDGE && type !== 'walls' && edges.length > 2) {
      await visuals.insertWall(edges[edges.length - 1], edges[0])
    }

    if (state === STATE_ROOMHEIGHT && type !== 'roomheight') {
      await visuals.setWallHeight(0)
    }

    if (type !== 'walls') {
      stopHeightUpdate()
      await visuals.hide('target')
    }

    if (((state === STATE_DOOR && type !== 'doors') || (state === STATE_WINDOW && type !== 'windows')) && currentObject) {
      await undo()
    }

    switch (type) {
      case 'walls':
        state = STATE_EDGE
        emit('event', 'TypeWalls')
        break
      case 'windows':
        state = STATE_WINDOW
        emit('event', 'TypeWindow')
        break
      case 'doors':
        state = STATE_DOOR
        emit('event', 'TypeDoor')
        break
      case 'roomheight':
        emit('event', 'TypeRoomHeight')
        state = STATE_ROOMHEIGHT
        await visuals.hide('currentwall')
        stopEdgeUpdate()
        startHeightUpdate()
        break
    }

    currentObject = null
    updateStatus()
  }

  async function stopCapture () {
    if (state !== STATE_STOPPED) {
      stopHeightUpdate()
      stopEdgeUpdate()
      await visuals.clearVisuals()
      state = STATE_STOPPED
      listener = {}
    }
  }

  function finishCapture () {
    hasRoomState = true
    emit('event', 'Finished')
  }

  async function capturePoint () {
    switch (state) {
      case STATE_EDGE:
        await captureEdge()
        break
      case STATE_WINDOW:
        await captureObject('window')
        break
      case STATE_DOOR:
        await captureObject('door')
        break
      case STATE_ROOMHEIGHT:
        await captureHeight()
        break
    }

    updateStatus()
  }

  async function undo () {
    let result = false
    switch (state) {
      case STATE_EDGE:
        result = await undoEdge()
        break
      case STATE_WINDOW:
        result = await undoObject('window')
        break
      case STATE_DOOR:
        result = await undoObject('door')
        break
      case STATE_ROOMHEIGHT:
        result = await undoHeight()
        break
    }

    updateStatus()
    return result
  }

//======================================================================================================================
// PRIVATE FUNCTIONS
//======================================================================================================================

  function resetRoomState () {
    if (state === STATE_STOPPED) {
      resetInternalState()
      hasRoomState = false
    } else {
      console.log('Can\'t reset room state while capturing.')
    }
  }

  function resetInternalState () {
    edges = []
    objects = {
      door: [],
      window: []
    }
    currentEdge = null
    currentObject = null
    currentHeight = 0

    stopHeightUpdate()
    stopEdgeUpdate()
  }

  function getInternalState () {
    return {edges, objects, roomHeight: roomHeight ? roomHeight / 10 : WALL_HEIGHT, objectModels}
  }

  // Capture
  //--------------------------------------------------------------------------------------------------------------------
  async function captureEdge () {
    stopEdgeUpdate()
    const position = await visuals.getTargetPosition()

    await visuals.setCurrentWallPosition(position)

    if (edges.length) {
      await visuals.insertWall(edges[edges.length - 1], position)
      emit('event', 'CapturedEdge')
    } else {
      emit('event', 'CapturedFirstEdge')
    }

    edges.push(position)
    startEdgeUpdate()
  }

  async function captureObject (type) {
    const pose = await camera.updatePose()
    const ray = getRayFromPose(pose)
    const intersections = getPlaneIntersections(ray, edges)

    if (intersections.length) {
      if (!currentObject) {
        // Captured first point of wall object.
        const {position, orientation} = intersections[0]
        if (type === 'door') {
          position.y = 0
        }

        if (CORE_HAS_CAMERASTRETCHBEHAVIOR) {
          await visuals.setCurrentWallObjectPose({position, orientation})
        } else {
          await visuals.displayWallObject({orientation, position: position, scale: {x: 0.05, y: 0.05, z: 0.001}})
        }

        currentObject = intersections[0]

        emit('event', 'Captured' + capitalizeFirstLetter(type) + 'FirstPoint')
      } else {
        // Captured second point of wall object.
        let intersection
        const currentWallIntersections = intersections.filter(intersection => intersection.start === currentObject.start && intersection.end === currentObject.end)

        if (currentWallIntersections.length) {
          intersection = currentWallIntersections[0]

          const bottomLeft = currentObject.position
          const topRight = intersection.position

          if (CORE_HAS_CAMERASTRETCHBEHAVIOR) {
            await visuals.insertWallObject(bottomLeft, topRight)
            await visuals.hide('currentwallobject')
          } else {
            await visuals.finishWallObject(bottomLeft, topRight)
          }

          objects[type].push({
            start: currentObject.start,
            end: currentObject.end,
            bottomLeft,
            topRight,
            type,
          })
          currentObject = null

          emit('event', 'Captured' + capitalizeFirstLetter(type))
        } else {
          console.log('Top right point not on same wall as bottom left point.')
        }
      }
    } else {
      emit('event', 'CaptureNoWallIntersection')
      console.log('No intersection with any wall.')
    }

  }

  function captureHeight () {
    if (currentHeight) {
      stopHeightUpdate()
      roomHeight = currentHeight
      emit('event', 'CapturedRoomHeight')
    }
  }

  // Undo
  //--------------------------------------------------------------------------------------------------------------------

  async function undoEdge () {
    if (edges.length) {
      if (edges.length > 1) {
        await visuals.removeLastWall()
      }

      edges.splice(edges.length - 1, 1)
      if (edges.length) {
        await visuals.setCurrentWallPosition(edges[edges.length - 1])
        emit('event', 'UndidEdge')
      } else {
        stopEdgeUpdate()
        await visuals.hide('currentwall')
        emit('event', 'UndidFirstEdge')
      }

      currentLength = 0
      return true
    }
    return false
  }

  async function undoObject (type) {
    if (!currentObject) {
      if (objects[type].length) {
        objects[type].splice(objects.length - 1, 1)
        await visuals.removeLastWallObject()
        emit('event', 'Undid' + capitalizeFirstLetter(type))
        return true
      }
    } else {
      if (CORE_HAS_CAMERASTRETCHBEHAVIOR) {
        await visuals.hide('currentwallobject')
      } else {
        await visuals.removeLastWallObject()
      }
      currentObject = null
      emit('event', 'Undid' + capitalizeFirstLetter(type) + 'FirstPoint')
      return true
    }

    return false
  }

  async function undoHeight () {
    if (roomHeight) {
      currentHeight = 0
      startHeightUpdate()
      roomHeight = null

      emit('event', 'UndidRoomHeight')
      emit('height', 0)
      visuals.setWallHeight(0)
      return true
    }

    return false
  }

  // Edge update
  //--------------------------------------------------------------------------------------------------------------------

  function startEdgeUpdate () {
    if (!edgeUpdate) {
      edgeUpdate = setInterval(updateEdge, CURRENT_EDGE_UPDATE_INTERVAL)
    }
  }

  function stopEdgeUpdate () {
    clearInterval(edgeUpdate)
    edgeUpdate = 0
    currentLength = 0
  }

  async function updateEdge () {
    if (!!edgeUpdate) {
      const position = await visuals.getTargetPosition()
      let length = 0
      if (CORE_HAS_CAMERASTRETCHBEHAVIOR) {
        if (edges.length) {
          length = vec3length(vec3sub(position, edges[edges.length - 1]))
        }
      } else {
        length = await visuals.setCurrentWallEndPosition(position)
      }

      if (!!edgeUpdate) {
        emit('length', length)
        currentLength = length
      }
    }
  }

  // Height measuring
  //--------------------------------------------------------------------------------------------------------------------

  function startHeightUpdate () {
    if (!heightUpdate) {
      heightUpdate = setInterval(updateHeight, HEIGHT_UPDATE_INTERVAL)
    }
  }

  function stopHeightUpdate () {
    if (heightUpdate) {
      clearInterval(heightUpdate)
      heightUpdate = 0
    }
  }

  async function updateHeight () {
    if (!!heightUpdate) {
      const pose = await camera.updatePose()
      const ray = getRayFromPose(pose)
      const intersections = getPlaneIntersections(ray, edges)
      let height = 0

      if (intersections.length) {
        height = intersections[0].position.y
        if (height < 0) {
          height = 0
        }
      }

      if (!!heightUpdate) {
        currentHeight = height

        emit('canCapture', canCapture())
        emit('height', height)
        visuals.setWallHeight(height)
      }
    }
  }

  // Tracking
  //--------------------------------------------------------------------------------------------------------------------

  // Checks if tracking provider is activated, the ground is confirmed and the augmented reality camera is active.
  function initTracking () {
    if (!tracker && trackers && Object.keys(trackers).length) {
      tracker = Object.values(trackers)[0]
    }

    if (!tracker) {
      throw new Error('Can\'t start room capturing: No tracking provider available.')
    }

    if (!tracker.active) {
      throw new Error('Can\'t start room capturing: Tracking provider not activated.')
    }

    if (!tracker.groundConfirmed) {
      throw new Error('Can\'t start room capturing: Tracking provider hasn\'t confirmed ground yet.')
    }

    if (!camera.active) {
      throw new Error('Can\'t start room capturing: Augmented reality camera not active.')
    }
  }

  // Models
  //--------------------------------------------------------------------------------------------------------------------

  async function initObjectModels () {
    if (!objectModels) {
      objectModels = {}
      for (let [type, id] of Object.entries(OBJECT_MODELS)) {
        const model = await modelManager.getModelFromRepository(id)
        const width = model.data.dimensions.z
        objectModels[type] = {
          id,
          width
        }
      }

    }
  }

  // Listener handling
  //--------------------------------------------------------------------------------------------------------------------

  function on (method, callbackFn) {
    if (!listener[method]) {
      listener[method] = []
    }

    listener[method].push(callbackFn)
  }

  function off (method, callbackFn) {
    if (listener[method]) {
      const index = listener[method].indexOf(callbackFn)
      if (index > -1) {
        listener[method].splice(index, 1)
      }
    }
  }

  function emit (method, ...args) {
    if (listener[method]) {
      for (let callbackFn of listener[method]) {
        if (callbackFn && typeof callbackFn === 'function') {
          callbackFn(...args)
        }
      }
    }
  }

  // Listener handling
  //--------------------------------------------------------------------------------------------------------------------

  function updateStatus () {
    emit('canUndo', canUndo())
    emit('canFinish', canFinish())
    emit('canCapture', canCapture())
  }

  function canUndo () {
    switch (state) {
      case STATE_EDGE:
        return edges.length
        break
      case STATE_ROOMHEIGHT:
        return !!roomHeight
        break
      case STATE_DOOR:
        return currentObject || objects['door'].length
        break
      case STATE_WINDOW:
        return currentObject || objects['window'].length
        break
    }

    return false
  }

  function canFinish () {
    switch (state) {
      case STATE_EDGE:
        return edges.length >= 3
        break
      case STATE_ROOMHEIGHT:
        return !!roomHeight
        break
      case STATE_DOOR:
        return !currentObject
        break
      case STATE_WINDOW:
        return !currentObject
        break
    }

    return false
  }

  function canCapture () {
    switch (state) {
      case STATE_EDGE:
        return true
        break
      case STATE_ROOMHEIGHT:
        return !roomHeight && currentHeight
        break
      case STATE_DOOR:
        return true
        break
      case STATE_WINDOW:
        return true
        break
    }

    return false
  }

}
*/
