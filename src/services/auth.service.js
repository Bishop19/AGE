import axios from "axios";

const IDENTITY_API_URL = process.env.REACT_APP_IDENTITY_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const signup = (email, password) => {
  return axios
    .post(`${IDENTITY_API_URL}:signUp?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.idToken);
      localStorage.setItem("refresh_token", response.data.refreshToken);
      return response.data.idToken;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

const login = (email, password) => {
  return axios
    .post(`${IDENTITY_API_URL}:signInWithPassword?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.idToken);
      localStorage.setItem("refresh_token", response.data.refreshToken);
      return response.data.idToken;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  return false;
};

const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  return token;
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
};
