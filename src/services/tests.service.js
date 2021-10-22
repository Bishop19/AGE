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

const getTests = (config_id) => {
  return instance
    .get(`/configurations/${config_id}/tests`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return [];
    });
};

const getTest = (config_id, test_id) => {
  return instance
    .get(`/configurations/${config_id}/tests/${test_id}`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

const createTest = (config_id, name, test_file, machine_type) => {
  return instance
    .post(`/configurations/${config_id}/tests`, {
      name,
      test_file,
      machine_type,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

const getRunningTest = (config_id) => {
  return instance
    .get(`/configurations/${config_id}/tests/running`, {})
    .then((response) => {
      if (!response.data) return false;
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return false;
    });
};

const getFinishedTests = (config_id) => {
  return instance
    .get(`/configurations/${config_id}/tests/finished`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return [];
    });
};

const addTestFile = (config_id, name, file) => {
  return instance
    .post(`/configurations/${config_id}/tests/file`, { name, file })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error.response?.data);
      return [];
    });
};

export default {
  getTests,
  getTest,
  createTest,
  getRunningTest,
  getFinishedTests,
  addTestFile,
};
