import axios from "axios";

function getUrl() {
  return "http://localhost:4000";
}

const axiosInstance = axios.create({
  baseURL: `${getUrl()}/api/v1`,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.baseURL = `${getUrl()}/api/v1`;
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };
