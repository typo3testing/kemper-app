import axios from "axios";

const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPEN_WEATHER_API_KEY = "caa082f7fb32b1127336f59f849d2c09";

const getWeather = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          //  console.log(response.data)
          const { main, id, description } = response.data.weather[0];
          const { temp, temp_min, temp_max, humidity } = response.data.main;
          const { speed, deg } = response.data.wind;
          const { all } = response.data.clouds;
          const { lon, lat } = response.data.coord;
          const { dt, name } = response.data;
          const { country } = response.data.sys;
          resolve({
            condition: main,
            description: description,
            date: new Date(dt * 1000),
            icon: id,
            location: {
              name: name,
              country: country,
              latitude: lat,
              longitude: lon
            },
            wind: {
              speed: speed,
              degree: deg
            },
            rain: all,
            temperature: {
              current: temp,
              minimum: temp_min,
              maximum: temp_max,
              humidity: humidity
            }
          });
        } else {
          reject("Weather data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getWeatherHome = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          //console.log(response.data)
          const { main, id, description } = response.data.weather[0];
          const { temp, temp_min, temp_max, humidity } = response.data.main;
          const { speed, deg } = response.data.wind;
          const { all } = response.data.clouds;
          const { lon, lat } = response.data.coord;
          const { dt, name } = response.data;
          const { country } = response.data.sys;
          resolve({
            condition: main,
            description: description,
            date: new Date(dt * 1000),
            icon: id,
            location: {
              name: name,
              country: country,
              latitude: lat,
              longitude: lon
            },
            wind: {
              speed: speed,
              degree: deg
            },
            rain: all,
            temperature: {
              current: temp,
              minimum: temp_min,
              maximum: temp_max,
              humidity: humidity
            }
          });
        } else {
          reject("Weather data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getDailyWeather = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          console.log(response.data);
          const location = {
            name: response.data.city.name,
            latitude: response.data.city.coord.lat,
            longitude: response.data.city.coord.lon
          };

          const dailyForecasts = response.data.list.map(fc => {
            return {
              condition: fc.weather[0].description,
              date: new Date(fc.dt * 1000),
              icon: fc.weather[0].id,
              location: location,
              temperature: {
                minimum: fc.main.temp_min,
                maximum: fc.main.temp_max,
                humidity: fc.main.humidity
              }
            };
          });

          resolve(dailyForecasts);
        } else {
          reject("Weather data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getHourlyWeather = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          const location = {
            name: response.data.city.name,
            latitude: response.data.city.coord.lat,
            longitude: response.data.city.coord.lon
          };

          const hourlyForecasts = response.data.list.map(fc => {
            return {
              condition: fc.weather[0].description,
              date: new Date(fc.dt * 1000),
              icon: fc.weather[0].id,
              location: location,
              temperature: {
                current: fc.main.temp
              }
            };
          });

          resolve(hourlyForecasts);
        } else {
          reject("Weather data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getLocationInformation = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          console.log(response.data);
          const location = {
            name: response.data.name,
            latitude: response.data.coord.lat,
            longitude: response.data.coord.lon
          };

          resolve(location);
        } else {
          reject("Weather data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getCityInformation = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          console.log(response.data);
          const cityInfo = response.data.list.map(fc => {
            return {
              name: fc.name,
              country: fc.sys.country,
              latitude: fc.coord.lat,
              longitude: fc.coord.lon,
              temperature: {
                minimum: fc.main.temp_min,
                maximum: fc.main.temp_max
              }
            };
          });

          resolve(cityInfo);
        } else {
          reject("Weather data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

class WeatherService {
  getCurrentWeatherByPosition({ latitude, longitude }) {
    if (!latitude) {
      throw Error("Latitude is required");
    }

    if (!longitude) {
      throw Error("Longitude is required");
    }

    const url = `${OPEN_WEATHER_BASE_URL}/weather?appid=${OPEN_WEATHER_API_KEY}&lang=de&lat=${latitude}&lon=${longitude}&units=metric`;
    console.log(url);

    return getWeather(url);
  }

  getCurrentWeatherHomeByPosition({ latitude, longitude }) {
    if (!latitude) {
      throw Error("Latitude is required");
    }

    if (!longitude) {
      throw Error("Longitude is required");
    }

    const url = `${OPEN_WEATHER_BASE_URL}/weather?appid=${OPEN_WEATHER_API_KEY}&lang=de&lat=${latitude}&lon=${longitude}&units=metric`;
    console.log(url);

    return getWeatherHome(url);
  }

  getDailyWeatherByPosition({ latitude, longitude }) {
    if (!latitude) {
      throw Error("Latitude is required");
    }

    if (!longitude) {
      throw Error("Longitude is required");
    }

    const url = `${OPEN_WEATHER_BASE_URL}/forecast?appid=${OPEN_WEATHER_API_KEY}&lang=de&lat=${latitude}&lon=${longitude}&units=metric`;

    return getDailyWeather(url);
  }

  getHourlyWeatherByPosition({ latitude, longitude }) {
    if (!latitude) {
      throw Error("Latitude is required");
    }

    if (!longitude) {
      throw Error("Longitude is required");
    }

    const url = `${OPEN_WEATHER_BASE_URL}/forecast?appid=${OPEN_WEATHER_API_KEY}&lang=de&lat=${latitude}&lon=${longitude}&units=metric&cnt=4`;

    return getHourlyWeather(url);
  }

  getLocationData({ location }) {
    if (!location) {
      throw Error("location is required");
    }

    const url = `${OPEN_WEATHER_BASE_URL}/weather?appid=${OPEN_WEATHER_API_KEY}&lang=de&q=${location}&units=metric`;

    return getLocationInformation(url);
  }

  getCityList({ location }) {
    if (!location) {
      throw Error("location is required");
    }

    const url = `${OPEN_WEATHER_BASE_URL}/find?appid=${OPEN_WEATHER_API_KEY}&q=${location}&units=metric`;

    return getCityInformation(url);
  }
}

export { WeatherService };
