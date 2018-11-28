import { withRouter } from 'react-router'
import { compose, lifecycle, pure, withState, withHandlers, withProps } from 'recompose'
import viewarApi from 'viewar-api'
import CaptureArea from './capture-area.jsx'
import { withDialogControls } from '../../services/dialog'

export const goTo = ({history}) => async (route) => {
  history.push(route)
}

export const subjectValue = ({setSubject}) => async (value) => {
  setSubject(value)
}

export const cameraCapture =  ({viewarApi, setCurrentScreenshotPath,setCapture}) => async () => {
  await viewarApi.screenshotManager.takeScreenshot()
  const path = await viewarApi.screenshotManager.saveScreenshot('screenshots')
  setCurrentScreenshotPath(path)
  setCapture(false)
}


export const saveScreenshot = ({viewarApi,showDialog}) => async () => {
  await viewarApi.screenshotManager.saveScreenshotToGallery()
   showDialog("image saved ", {
        confirmText: 'DialogOK'
    });  
}

export const emailScreenshot = ({viewarApi,currentScreenshotPath,showDialog,subject}) => async () => {
  //await viewarApi.screenshotManager.emailScreenshot()  
  //await viewarApi.appUtils.sendEmail({subject:'Subject',message:'Message',attachments: {currentScreenshotPath} });
  viewarApi.appUtils.sendEmail({
    subject: subject,
    message: '',
    recipients: ['daniel@vonuebermorgen.de'],
    attachments: currentScreenshotPath
  });
}

export const shareScreenshot = ({viewarApi, currentScreenshotPath}) => async () => {
  const screenshotManager = viewarApi.screenshotManager
  await screenshotManager.shareScreenshot('native', currentScreenshotPath)
}

export const cancelScreenshot = ({viewarApi, setCurrentScreenshotPath,setCapture}) => async () => {
  setCurrentScreenshotPath(null)
  setCapture(true)
}
export const getScreenshotImage = ({viewarApi, currentScreenshotPath}) => () => viewarApi.coreInterface.resolveUrl(currentScreenshotPath)

export default compose(
  withRouter,
  withDialogControls,
  withState('currentScreenshotPath', 'setCurrentScreenshotPath', null),
  withState('capture', 'setCapture', true),
  withState('subject', 'setSubject', ''),
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
    async componentDidMount () {
      const camera = viewarApi.cameras.arCamera;
      await camera.activate();
    },
    async componentWillUnmount () {
      await viewarApi.cameras.arCamera.unfreeze()
    }
  }),
)(CaptureArea)
