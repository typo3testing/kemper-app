import React from "react";
import cx from "classnames";
import { Redirect } from "react-router";
import styles from "./dealer-finder.css";
import globalStyles from "../../../css/global.css";

import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";

import { ApiService } from "../../services/ApiService";
const apiService = new ApiService();

export class DealerFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      content: [],
      dataReady: true
    };
    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  componentDidMount() {
    let land = sessionStorage.getItem("land");
    let postalcode = sessionStorage.getItem("postalcode");
    apiService
      .findDealer({ land, postalcode })
      .then(data => {
        this.setState({ content: data.content });
        this.setState({ dataReady: false });
        console.log(data.content);
      })
      .catch(error => console.log(error));
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClick(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  render() {
    const style = {
      width: "100%",
      height: "100vh",
      marginLeft: "auto",
      marginRight: "auto"
    };

    let contentTemplate = this.state.content.map(v => (
      <Marker
        onClick={this.onMarkerClick}
        title={""}
        position={{ lat: v.latitude, lng: v.longitude }}
        name={v.company}
        key={v.uid}
        icon={{url: "/assets/images/icons/marker.png"}}
      />
    ));
    if (this.state.dataReady) {
      return (
        <div className={cx(globalStyles.ContentPadTypeThree)}>
          <div
            className={cx(globalStyles.Element, globalStyles.ElementGapMedium)}
          >
            <div
              className={cx(globalStyles.SiteFormModule, globalStyles.Clearfix)}
            >
              <div
                className={cx(
                  globalStyles.CustomLoading,
                  globalStyles.PullTextCenter
                )}
              >
                <div className={cx(globalStyles.Tablewrap)}>
                  <div
                    className={cx(
                      globalStyles.Tablecell,
                      globalStyles.Tablemiddleline
                    )}
                  >
                    Wird geladen...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <Map
        item
        xs={12}
        style={style}
        google={this.props.google}
        onClick={this.onMapClick}
        zoom={6}
        disableDefaultUI={true}
        initialCenter={{ lat: 51.3622808, lng: 9.464591 }}
      >
        {contentTemplate}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <div className={cx(globalStyles.MapInfo)}
              dangerouslySetInnerHTML={{
                __html: this.state.selectedPlace.name
              }}
            />
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyBUEgi6ez8PJQnzDkgd8hinbc3vBfr3x9Y"
})(DealerFinder);
