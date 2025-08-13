import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const url = 'http://Mac-Ale.local:3000';
// const url = '192.168.0.148:3000';
// const url = 'http://localhost:3000';

export const api = axios.create({
  baseURL: url, // your API server
  // timeout: 20000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a request interceptor. I am using it to add token to headers
api.interceptors.request.use(
  async config => {
    // Fetch the token from SecureStorer
    const token = await SecureStore.getItemAsync('userToken');

    // If the token exists, set it in the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry and refresh token
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    // Check if the error is due to an expired or invalid token
    if (
      error.response.status === 401 &&
      error.response.data.message === 'Unauthorized or Token Expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Fetch a new token
      const refreshedToken = await refreshToken();

      // Update the token in SecureStore
      await SecureStore.setItemAsync('userToken', refreshedToken.accessToken);
      await SecureStore.setItemAsync(
        'refreshUserToken',
        refreshedToken.refreshToken
      );

      // Set the Authorization header to the new token
      api.defaults.headers.common['Authorization'] =
        `Bearer ${refreshedToken.accessToken}`;

      // Retry the original request
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// This function will handle the token refresh logic
// You'll need to adjust this to your server's refresh token endpoint and logic
async function refreshToken(): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const refreshToken = await SecureStore.getItemAsync('refreshUserToken');
  console.log(refreshToken);

  // Make a request to the refresh token endpoint
  const response = await api.post('/users/refreshToken', { refreshToken });

  // Assuming the new token is returned in the response data
  return response.data;
}
