import axios from "axios";

const backendUrl = "http://localhost:3000/api";

const AuthAxios = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

AuthAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AuthAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AuthAxios;
