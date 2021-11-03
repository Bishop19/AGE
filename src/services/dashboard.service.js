import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://agp-config-manager.herokuapp.com';

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

const getDashboardInfo = () => {
  return instance
    .get(`/dashboard`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

export default {
  getDashboardInfo,
};
