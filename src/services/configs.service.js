import axios from 'axios';
import fileDownload from 'js-file-download';

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
      console.error('Error:', error.response?.data);
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
      console.error('Error:', error.response?.data);
      return false;
    });
};

const createConfig = (name, domain, endpoints, gateways, clouds) => {
  return instance
    .post(`/configurations`, {
      name,
      domain,
      endpoints,
      gateways,
      clouds,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

const getGatewayConfig = (id, gateway) => {
  return instance
    .get(`/configurations/${id}/${gateway}`)
    .then((response) => {
      fileDownload(JSON.stringify(response.data, undefined, 2), gateway);
      return true;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

export default {
  getConfigs,
  getConfig,
  createConfig,
  getGatewayConfig,
};
