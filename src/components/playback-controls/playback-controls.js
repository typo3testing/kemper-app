import {
  compose,
  withState,
  withHandlers,
  withProps,
  withPropsOnChange
} from "recompose";

import PlaybackControls from "./playback-controls.jsx";

export const isPlaying = playable => playable.state === "playing";
export const isPaused = playable => playable.state === "paused";
export const isStopped = playable => playable.state === "stopped";

export const play = ({ updatePlayables }) => async playable => {
  switch (playable.state) {
    case "stopped":
      await playable.start();
      break;
    case "paused":
      await playable.resume();
      break;
  }
  updatePlayables();
};

export const pause = ({ updatePlayables }) => async playable => {
  switch (playable.state) {
    case "playing":
      await playable.pause();
      break;
  }
  updatePlayables();
};

export const stop = ({ updatePlayables }) => async playable => {
  switch (playable.state) {
    case "playing":
      await playable.stop();
      break;
    case "paused":
      await playable.stop();
      break;
  }
  updatePlayables();
};

export const updatePlayables = ({ setPlayables, instance }) => () =>
  setPlayables(
    instance
      ? [
          ...Object.values(instance.animations),
          ...Object.values(instance.videos)
        ]
      : []
  );

export default compose(
  withState("playables", "setPlayables", ({ instance }) =>
    instance
      ? [
          ...Object.values(instance.animations),
          ...Object.values(instance.videos)
        ]
      : []
  ),
  withHandlers({
    updatePlayables
  }),
  withProps({
    isPlaying,
    isPaused,
    isStopped
  }),
  withHandlers({
    play,
    pause,
    stop
  }),
  withPropsOnChange(["instance"], ({ updatePlayables }) => updatePlayables())
)(PlaybackControls);
