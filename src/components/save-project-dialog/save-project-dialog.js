import {
  compose,
  withProps,
  withState,
  withHandlers,
  withPropsOnChange,
  lifecycle
} from "recompose";

import SaveProjectDialog from "./save-project-dialog.jsx";

export default compose(
  withState("input", "setInput", ""),
  withHandlers({
    onConfirm: ({ input, onSaveProject }) => isCloudProject =>
      onSaveProject({
        projectName: input,
        confirmed: true,
        isCloudProject
      }),
    onCancel: ({ onSaveProject }) => () =>
      onSaveProject({
        cancelled: true
      })
  })
)(SaveProjectDialog);
