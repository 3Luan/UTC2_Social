import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_URL_BACKEND}`,
  // timeout: 30000,
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Enhanced logging of the error
    // if (error.response) {
    //   console.log('Error Response:', error.response);
    //   console.log('Error Data:', error.response.data);
    //   console.log('Error Status:', error.response.status);
    // } else if (error.request) {
    //   console.log('Error Request:', error.request);
    // } else {
    //   console.log('Error Message:', error.message);
    // }
    // console.log('Error Config:', error.config);

    // Forward the error
    return Promise.reject(error.response ? error.response : error);
  }
);

export default instance;
