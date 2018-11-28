export const activateStep = ({ roomCapture }) => async () => {
  await roomCapture.nextState();
};
