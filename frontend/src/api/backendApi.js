import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_URL_BACKEND}`,
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    return Promise.reject(error.response ? error.response : error);
  }
);

export default instance;
