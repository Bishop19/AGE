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

const createConfig = (name, domain, endpoints, gateways, cloud) => {
  return instance
    .post(`/configurations`, {
      name,
      domain,
      endpoints,
      gateways,
      cloud,
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
  let extension, file;

  return instance
    .get(`/configurations/${id}/${gateway}`, {
      responseType: gateway === 'tyk' ? 'blob' : '',
    })
    .then((response) => {
      switch (gateway) {
        case 'krakend':
          file = JSON.stringify(response.data, undefined, 2);
          extension = '.json';
          break;
        case 'kong':
          file = response.data;
          extension = '.yml';
          break;
        case 'tyk':
          file = response.data;
          extension = '.zip';
          break;
      }
      fileDownload(file, gateway + extension);
      return true;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

const deployGateways = (id) => {
  return instance
    .post(`/configurations/${id}/deploy`, {
      id,
    })
    .then((response) => {
      return response.data;
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
  deployGateways,
};
