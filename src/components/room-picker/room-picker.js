import {
  compose,
  withProps,
  withState,
  withHandlers,
  defaultProps
} from "recompose";

import RoomPicker from "./room-picker.jsx";

import rooms from "../../services/room-templates";

export const handleSelect = ({ setSelectedRoom, onSelect }) => room => {
  setSelectedRoom(room);
  onSelect(room);
};

export default compose(
  defaultProps({
    onSelect: () => {}
  }),
  withProps(({}) => ({
    rooms
  })),
  withState("selectedRoom", "setSelectedRoom", {}),
  withHandlers({
    handleSelect
  })
)(RoomPicker);
