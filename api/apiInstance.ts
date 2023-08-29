import axios from 'axios';

const url = 'http://192.168.0.100:3000';

export const api = axios.create({
  baseURL: url, // your API server
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
