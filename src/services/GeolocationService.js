import axios from "axios";

const BASE_URL = "https://www.googleapis.com/geolocation/v1/geolocate";
const API_KEY = "AIzaSyBUEgi6ez8PJQnzDkgd8hinbc3vBfr3x9Y";

class GeolocationService {
  getCurrentPosition() {
    const url = `${BASE_URL}?key=${API_KEY}`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, { considerIp: true })
        .then(response => {
          if (response && response.status === 200) {
            const { lat, lng } = response.data.location;

            sessionStorage.setItem("local_lat", lat);
            sessionStorage.setItem("local_long", lng);
            sessionStorage.setItem("cur_local_lat", lat);
            sessionStorage.setItem("cur_local_long", lng);

            resolve({
              latitude: lat,
              longitude: lng
            });
          } else {
            reject("Unable to retrieve current location");
          }
        })
        .catch(error => {
          /*
                    const { errors } = error.response.data.error;
                    if (errors && errors.length > 0) {
                        errors.forEach(e => console.log(`Error: ${e.message}, Reason: ${e.reason}`));
                    }
                    */
          reject("Unable to retrieve current location");
        });
    });
  }
}

export { GeolocationService };
