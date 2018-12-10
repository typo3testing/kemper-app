import axios from "axios";

const API_BASE_URL = "https://kemperol.kemper-system.de/";

const getLandData = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          resolve(response.data.results);
        } else {
          reject("Land data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getDealerData = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          resolve(response.data.results);
        } else {
          reject("dealer data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getProductData = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          resolve(response.data.results);
        } else {
          reject("product data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};
const getProductCalculatorData = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          resolve(response.data.results);
        } else {
          reject("product calculator data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

const getNewsData = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        if (response && response.status === 200) {
          resolve(response.data.results);
        } else {
          reject("new  data not found");
        }
      })
      .catch(error => reject(error.message));
  });
};

class ApiService {
  getLand() {
    const url = `${API_BASE_URL}?api=kemper&action=land`;
    console.log(url);
    return getLandData(url);
  }

  findDealer({ land, postalcode }) {
    const url = `${API_BASE_URL}?api=kemper&action=map&land=${land}&postalcode=${postalcode}`;
    console.log(url);
    return getDealerData(url);
  }

  getProduct() {
    const url = `${API_BASE_URL}?api=kemper&action=product`;
    console.log(url);
    return getProductData(url);
  }

  getProductCalculator({ product, area }) {
    const url = `${API_BASE_URL}?api=kemper&action=calculator&product=${product}&area=${area}`;
    console.log(url);
    return getProductCalculatorData(url);
  }

  getNews() {
    const url = `${API_BASE_URL}?api=kemper&action=news`;
    console.log(url);
    return getNewsData(url);
  }
}

export { ApiService };
