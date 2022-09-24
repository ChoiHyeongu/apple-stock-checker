import axios from 'axios';
import config from '../config/index.js';

const instance = axios.create({
  baseURL: config.APPLE_BASE_URL,
});

export async function get(url, axiosConfig) {
  try {
    const response = await instance.get(`${config.APPLE_BASE_URL}${url}`, axiosConfig);
    return response?.data;
  } catch (err) {}
}

export default { get };
