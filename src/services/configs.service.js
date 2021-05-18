import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}`,
});

instance.interceptors.request.use(
  (config) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getConfigs = () => {
  return instance
    .get(`/configurations`, {})
    .then((response) => {
      const configs = response.data;

      // Evaluate state for each config
      configs.forEach((config) => {
        if (config.tests.length === 0) {
          config.state = 'No results';
        } else if (!config.tests[config.tests.length - 1].is_finished) {
          config.state = 'Running';
        } else {
          config.state = 'Finished';
        }
      });

      return configs;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const getConfig = (id) => {
  return instance
    .get(`/configurations/${id}`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

const createConfig = (endpoints, gateways, clouds) => {
  return instance
    .post(`/configurations`, {
      endpoints,
      gateways,
      clouds,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

export default {
  getConfigs,
  getConfig,
  createConfig,
};
