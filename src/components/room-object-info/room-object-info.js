import {
  compose,
  withProps,
  withState,
  withPropsOnChange,
  withHandlers
} from "recompose";

import RoomObjectInfo from "./room-object-info.jsx";

export const getName = element => {
  if (element.isRoom) {
    return "Floor";
  } else if (element.isWall) {
    return "Wall";
  } else {
    return element.type;
  }
};

export const getType = element => {
  if (element.isRoom) {
    return "floor";
  } else if (element.isWall) {
    return "wall";
  } else {
    return element.type;
  }
};

export const createApplyCalls = () => {
  const refs = {};
  return {
    attachApply: () => (type, ref) => (refs[type] = ref),
    detachApply: () => type => delete refs[type],
    applyChanges: () => async () => {
      for (let ref of Object.values(refs)) {
        await ref.apply();
      }
    }
  };
};

export default compose(
  withProps({
    getName,
    getType
  }),
  withState("name", "setName", ""),
  withState("type", "setType", ""),
  withHandlers(createApplyCalls()),
  withPropsOnChange(
    ["object"],
    ({ object, setName, setType, getName, getType }) => {
      if (object) {
        setName(getName(object));
        setType(getType(object));
      }
    }
  )
)(RoomObjectInfo);
