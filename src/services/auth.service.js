import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const signup = (email, password, first_name, last_name) => {
  return axios
    .post(`${API_URL}/register`, {
      email,
      password,
      first_name,
      last_name,
    })
    .then((response) => {
      localStorage.setItem('token', response.data.access_token);
      return response.data.access_token;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

const login = (email, password) => {
  return axios
    .post(`${API_URL}/auth`, {
      email,
      password,
    })
    .then((response) => {
      localStorage.setItem('token', response.data.access_token);
      return response.data.access_token;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

const logout = () => {
  localStorage.removeItem('token');
  return false;
};

const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  return token;
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
};
