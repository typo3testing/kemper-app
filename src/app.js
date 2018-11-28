import { MemoryRouter, Route, withRouter } from "react-router";
import React, { Fragment } from "react";
import { AnimatedSwitch } from "react-router-transition";
import { compose, lifecycle, withState } from "recompose";

import Home from "./views/home/home.js";
import Calibration from "./views/calibration/calibration.js";
import Projects from "./views/projects/projects.js";
import RoomCapture from "./views/room-capture/room-capture.js";
import RoomPlanner from "./views/room-planner/room-planner.js";
import Main from "./views/main/main.js";
import FreezeFrame from "./views/freeze-frame/freeze-frame.js";
import RoomSelection from "./views/room-selection/room-selection.js";
import ViewSelection from "./views/view-selection/view-selection.js";
import Walk from "./views/walk/walk.js";
import Info from "./views/info/info.js";
import ShopFinder from "./views/shop-finder/shop-finder.js";
import CustomPage from "./views/custom-page/custom-page.js";
import Help from "./views/help/help.js";
import CalculateAmount from "./views/calculate-amount/calculate-amount.js";
import FindTrader from "./views/find-trader/find-trader.js";
import News from "./views/news/news.js";
import Weather from "./views/weather/weather.js";
import CalculatedQuantities from "./views/calculated-quantities/calculated-quantities.js";
import FoundTraders from "./views/found-traders/found-traders.js";
import CalculateArea from "./views/calculate-area/calculate-area.js";
import CaptureArea from "./views/capture-area/capture-area.js";
import CitySearch from "./views/city-search/city-search.js";

import Spinner from "./components/spinner/spinner.jsx";
import Toast from "./components/toast/toast";
import Dialog from "./components/dialog/dialog";

import { withLoading, withToast } from "./services/loading";
import { withDialog } from "./services/dialog";

import googleAnalytics from "./services/google-analytics/index";

const EnhancedSpinner = withLoading()(Spinner);
const EnhancedToast = withToast()(Toast);
const EnhancedDialog = withDialog()(Dialog);

const GaMonitor = compose(
  withRouter,
  lifecycle({
    componentDidMount() {
      this.props.history.listen(location => {
        googleAnalytics.logScreenView(location.pathname);
      });
    }
  })
)(({ children }) => <div>{children}</div>);

export default ({}) => (
  <Fragment>
    <EnhancedToast key="toast" />
    <EnhancedSpinner key="spinner" />
    <EnhancedDialog key="dialog" />
    <MemoryRouter key="router">
      <GaMonitor>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="SwitchWrapper"
        >
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/calibration-main"
            component={(...props) => (
              <Calibration {...props} nextView={"/main"} />
            )}
          />
          <Route
            exact
            path="/calibration-capture"
            component={(...props) => (
              <Calibration {...props} nextView={"/room-capture"} />
            )}
          />
          <Route exact path="/freeze-frame" component={FreezeFrame} />
          <Route exact path="/room-capture" component={RoomCapture} />
          <Route exact path="/room-planner" component={RoomPlanner} />
          <Route exact path="/projects" component={Projects} />
          <Route
            exact
            path="/main"
            component={(...props) => <Main {...props} />}
          />
          <Route
            exact
            path="/main-capture"
            component={(...props) => (
              <Main {...props} prevView={"/view-selection"} />
            )}
          />
          <Route
            exact
            path="/view-selection-ar"
            component={(...props) => <ViewSelection hasARMode />}
          />
          <Route exact path="/view-selection" component={ViewSelection} />
          <Route exact path="/room-selection" component={RoomSelection} />
          <Route exact path="/walk" component={Walk} />
          <Route exact path="/info" component={Info} />
          <Route exact path="/shop-finder" component={ShopFinder} />
          <Route exact path="/custom-page" component={CustomPage} />
          <Route exact path="/help" component={Help} />
          <Route exact path="/calculate-amount" component={CalculateAmount} />
          <Route exact path="/find-trader" component={FindTrader} />
          <Route exact path="/news" component={News} />
          <Route exact path="/weather" component={Weather} />
          <Route path="/weather:handle" component={Weather} />
          <Route
            exact
            path="/calculated-quantities"
            component={CalculatedQuantities}
          />
          <Route exact path="/found-traders" component={FoundTraders} />
          <Route exact path="/calculate-area" component={CalculateArea} />
          <Route exact path="/capture-area" component={CaptureArea} />
          <Route exact path="/city-search" component={CitySearch} />
        </AnimatedSwitch>
      </GaMonitor>
    </MemoryRouter>
  </Fragment>
);
