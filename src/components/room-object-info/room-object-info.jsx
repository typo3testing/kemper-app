import React from "react";
import cx from "classnames";
import capitalize from "lodash/capitalize";

import { translate } from "../../services";

import InfoWallObject from "./info-wall-object";
import InfoWall from "./info-wall";
import InfoFloor from "./info-floor";
import DetailContainer from "../detail-container/detail-container.js";
import DetailHeader from "../detail-header/detail-header.js";
import DetailContent from "../detail-content/detail-content.js";

import styles from "./room-object-info.css";
import globalStyles from "../../../css/global.css";

export default ({
  object,
  objects,
  updateObject,
  deleteObject,
  materials,
  className,
  name,
  type,
  attachApply,
  applyChanges,
  detachApply
}) => (
  <div className={cx(styles.Container, styles[`type-${type}`], className)}>
    <DetailContainer
      gap={type === "door" ? "right2" : type === "window" ? "right3" : "right1"}
    >
      <DetailHeader className={styles.DetailHeader}>
        <div className={styles.Title}>{translate(capitalize(name))}</div>
        <div
          className={cx(
            styles.Button,
            globalStyles.CustomFont2,
            globalStyles.BorderDark,
            globalStyles.ButtonColor2,
            globalStyles.ButtonTextColor
          )}
          onClick={applyChanges}
        >
          {translate("RoomPlannerSave")}
        </div>
      </DetailHeader>
      <DetailContent>
        {type === "floor" && (
          <InfoFloor
            object={object}
            materials={materials}
            updateObject={updateObject}
            attachApply={attachApply}
            detachApply={detachApply}
          />
        )}
        {type === "wall" && (
          <InfoWall
            object={object}
            materials={materials}
            updateObject={updateObject}
            deleteObject={deleteObject}
            attachApply={attachApply}
            detachApply={detachApply}
          />
        )}
        {(type === "door" || type === "window") && (
          <InfoWallObject
            object={object}
            objects={objects[type]}
            updateObject={updateObject}
            deleteObject={deleteObject}
            withVerticalOffset={type === "window"}
            attachApply={attachApply}
            detachApply={detachApply}
          />
        )}
      </DetailContent>
    </DetailContainer>
  </div>
);
