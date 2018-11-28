import { withRouter } from "react-router";
import { compose, withHandlers, lifecycle, withProps } from "recompose";

import viewarApi from "viewar-api";

import FreezeFrame from "./freeze-frame.jsx";

export default compose(
  withRouter,
  withHandlers({}),
  lifecycle({
    async componentDidMount() {
      // const { augmentedRealityCamera } = await this.props.getCameras()
      // augmentedRealityCamera.activate()
    },
    async componentWillUnmount() {
      await viewarApi.cameras.arCamera.unfreeze();
    }
  })
)(FreezeFrame);
