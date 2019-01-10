import { withRouter } from "react-router";
import {
  compose,
  lifecycle,
  pure,
  withState,
  withHandlers,
  withProps
} from "recompose";
import viewarApi from "viewar-api";
import CaptureArea from "./capture-area.jsx";
import { withDialogControls } from "../../services/dialog";

export const goTo = ({ history }) => async route => {
  history.push(route);
};

export const subjectValue = ({ setSubject }) => async value => {
  setSubject(value);
};

export const cameraCapture = ({
  viewarApi,
  setCurrentScreenshotPath,
  setCapture
}) => async () => {
  await viewarApi.screenshotManager.takeScreenshot();
  const path = await viewarApi.screenshotManager.saveScreenshot("screenshots");
  setCurrentScreenshotPath(path);
  setCapture(false);
};

export const saveScreenshot = ({ viewarApi, showDialog }) => async () => {
  await viewarApi.screenshotManager.saveScreenshotToGallery();
  showDialog("image saved ", {
    confirmText: "DialogOK"
  });
};

export const emailScreenshot = ({
  viewarApi,
  currentScreenshotPath,
  showDialog,
  subject
}) => async () => {
  //await viewarApi.screenshotManager.emailScreenshot()
  //await viewarApi.appUtils.sendEmail({subject:'Subject',message:'Message',attachments: {currentScreenshotPath} });
  /*viewarApi.appUtils.sendEmail({
    subject: subject,
    message: '',
    recipients: ['daniel@vonuebermorgen.de'],
    attachments: currentScreenshotPath
  });*/

  /*var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");

   
      const image = new Image();
      image.src = currentScreenshotPath;
      image.onload = () => {
        context.drawImage(image, 0, 0, imgContext.width, imgContext.height);
      };
    var imgAsDataURL = imgCanvas.toDataURL("image/png");
  showDialog(imgAsDataURL, {
        confirmText: 'DialogOK'
  });*/

  var canvas = document.getElementById("canvas");
  var dataURL = canvas.toDataURL();
  showDialog(dataURL, {
    confirmText: "DialogOK"
  });
  /* 
   var image_data = dataURL.split('data:image/png;base64,');
    image_data = image_data[1];
    const fs = fetch_blob.fs
    const dirs = fetch_blob.fs.dirs 
    const file_path = dirs.DCIMDir + "/haha.png"
    RNFS.writeFile(file_path, image_data, 'base64')
    .catch((error) => {
      alert(JSON.stringify(error));
    });
    */
  /*viewarApi.appUtils.sendEmail({
    subject: subject,
    message: dataURL,
    recipients: ['daniel@vonuebermorgen.de'],
    attachments: currentScreenshotPath
  });*/
};

export const shareScreenshot = ({
  viewarApi,
  currentScreenshotPath
}) => async () => {
  const screenshotManager = viewarApi.screenshotManager;
  await screenshotManager.shareScreenshot("native", currentScreenshotPath);
};

export const cancelScreenshot = ({
  viewarApi,
  setCurrentScreenshotPath,
  setCapture
}) => async () => {
  setCurrentScreenshotPath(null);
  setCapture(true);
};
export const getScreenshotImage = ({
  viewarApi,
  currentScreenshotPath
}) => () => viewarApi.coreInterface.resolveUrl(currentScreenshotPath);

export default compose(
  withRouter,
  withDialogControls,
  withState("currentScreenshotPath", "setCurrentScreenshotPath", null),
  withState("capture", "setCapture", true),
  withState("subject", "setSubject", ""),
  withProps({
    viewarApi
  }),
  withHandlers({
    goTo,
    cameraCapture,
    saveScreenshot,
    emailScreenshot,
    shareScreenshot,
    cancelScreenshot,
    getScreenshotImage,
    subjectValue
  }),
  lifecycle({
    async componentDidMount() {
      const camera = viewarApi.cameras.arCamera;
      await camera.activate();
    },
    async componentWillUnmount() {
      await viewarApi.cameras.arCamera.unfreeze();
    }
  })
)(CaptureArea);
