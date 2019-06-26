import axios from "axios";
import { message } from "antd";
import Storage from "./storage";

const storage = new Storage();

const baseURL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3001' : 'http://ac.cixi518.com'
// create an axios instance
const service = axios.create({
  baseURL, // api的base_url
  timeout: 5000 // request timeoutheaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

// request interceptor
service.interceptors.request.use(
  config => {
    message.loading("网络请求中");
    const userinfo = storage.getStorage("userinfo");
    if (userinfo && userinfo.token) {
      config.headers.token = userinfo.token;
    }
    if (config.code !== 0) {
      message.info("网络警告:" + config.msg);
    }
    return config;
  },
  error => {
    message.info("network request error:" + error);
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  response => {
    message.destroy();
    return response.data;
  },
  error => {
    message.info("network error:" + error.message);
    return Promise.reject(error);
  }
);

export default service;
