import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import DetailContainer from "../../components/detail-container/detail-container";
import DetailHeader from "../../components/detail-header/detail-header";
import DetailContent from "../../components/detail-content/detail-content";

import styles from "./room-picker.css";
import globalStyles from "../../../css/global.css";

export default ({ handleSelect, rooms, selectedRoom, onManual, className }) => (
  <div className={cx(styles.Container, className)}>
    <DetailContainer>
      <DetailHeader>{translate("RoomPickerHeader")}</DetailHeader>
      <DetailContent>
        <p>{translate("RoomPickerDescription")}</p>
        <div className={cx(styles.Rooms)}>
          {rooms.map(room => (
            <div
              className={cx(styles.Room, globalStyles.BorderDark, {
                [styles.active]: selectedRoom.name === room.name
              })}
              key={room.name}
              onClick={() => handleSelect(room)}
            >
              <img className={styles.RoomIcon} src={room.imageUrl} />
            </div>
          ))}
        </div>
        <div
          className={cx(
            styles.ButtonSketch,
            globalStyles.CustomFont3,
            globalStyles.ButtonColor2,
            globalStyles.ButtonTextColor
          )}
          onClick={onManual}
        >
          {translate("RoomPickerSketch")}
        </div>
      </DetailContent>
    </DetailContainer>
  </div>
);
