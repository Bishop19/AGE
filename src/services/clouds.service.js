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

const getClouds = () => {
  return instance
    .get(`/clouds`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const createCloud = (name, key, provider) => {
  return instance
    .post(`/clouds`, {
      name,
      key,
      provider,
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
  getClouds,
  createCloud,
};
