import React from "react";
import cx from "classnames";

import { translate } from "../../services";

import Button from "../button/button.js";
import DetailContainer from "../detail-container/detail-container.js";
import DetailHeader from "../detail-header/detail-header.js";
import DetailContent from "../detail-content/detail-content.js";

import styles from "./playback-controls.css";
import globalStyles from "../../../css/global.css";

export default ({
  header,
  content,
  className,
  instance,
  playables,
  isPlaying,
  isPaused,
  isStopped,
  play,
  pause,
  stop,
  gapOffset
}) => (
  <div className={cx(styles.Container, className)}>
    <DetailContainer gap={"left" + (3 + gapOffset)}>
      <DetailHeader>{translate("PlaybackControlsTitle")}</DetailHeader>
      <DetailContent className={styles.Content}>
        <div className={styles.Playables}>
          {playables.map((playable, index) => (
            <div
              key={index}
              className={cx(styles.Playable, globalStyles.BorderDark)}
            >
              <div className={styles.Name}>{playable.name}</div>
              {!isPlaying(playable) && (
                <Button
                  className={styles.Control}
                  size="small"
                  icon="play_outlined"
                  dark
                  onClick={() => play(playable)}
                />
              )}
              {!isPaused(playable) && !isStopped(playable) && (
                <Button
                  className={styles.Control}
                  size="small"
                  dark
                  icon="pause_outlined"
                  onClick={() => pause(playable)}
                />
              )}
              {!isStopped(playable) && (
                <Button
                  className={styles.Control}
                  size="small"
                  icon="stop_outlined"
                  dark
                  onClick={() => stop(playable)}
                />
              )}
            </div>
          ))}
        </div>
      </DetailContent>
    </DetailContainer>
  </div>
);
