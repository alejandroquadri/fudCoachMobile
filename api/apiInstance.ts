import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const url = 'http://Mac-Ale.local:3000'; // para desarrollo local
// const url = 'http://api.local.fud.coach'; // para desarrollo local desde docker net. No va a funcionar desde el telefono. No tiene mucha utilidad en realidad
// const url = 'https://api.fud.coach'; // backend de produccion

export const api = axios.create({
  baseURL: url, // your API server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor. I am using it to add token to headers
api.interceptors.request.use(
  async config => {
    // Fetch the token from SecureStorer
    const token = await SecureStore.getItemAsync('userToken');

    console.log('token de acceso:', token);
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

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 1) If there is no response at all, this is likely a network error.
    // Do NOT try to refresh; just let the caller handle it.
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message;

    // 2) Handle expired or invalid token once per request
    if (
      status === 401 &&
      message === 'Unauthorized or Token Expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshedToken = await refreshToken();

        // Persist new tokens
        await SecureStore.setItemAsync('userToken', refreshedToken.accessToken);
        await SecureStore.setItemAsync(
          'refreshUserToken',
          refreshedToken.refreshToken
        );

        // Update default header for future requests
        api.defaults.headers.common.Authorization = `Bearer ${refreshedToken.accessToken}`;

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${refreshedToken.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, propagate the error so the caller can logout, etc.
        return Promise.reject(refreshError);
      }
    }

    // 3) For any other error, just propagate it
    return Promise.reject(error);
  }
);

const refreshToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const storedRefreshToken = await SecureStore.getItemAsync('refreshUserToken');

  if (!storedRefreshToken) {
    throw new Error('No refresh token available');
  }

  // Use a bare axios instance so we do NOT hit interceptors again here
  const response = await axios.post(
    `${url}/users/refreshToken`,
    { refreshToken: storedRefreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = response.data;

  if (!data || !data.accessToken || !data.refreshToken) {
    throw new Error('Invalid refresh token response from server');
  }

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
};

// // Response interceptor to handle token expiry and refresh token
// api.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;
//     // Check if the error is due to an expired or invalid token
//     if (
//       error.response.status === 401 &&
//       error.response.data.message === 'Unauthorized or Token Expired' &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//
//       // Fetch a new token
//       const refreshedToken = await refreshToken();
//
//       // Update the token in SecureStore
//       await SecureStore.setItemAsync('userToken', refreshedToken.accessToken);
//       await SecureStore.setItemAsync(
//         'refreshUserToken',
//         refreshedToken.refreshToken
//       );
//
//       console.log(refreshedToken.accessToken);
//       // Set the Authorization header to the new token
//       api.defaults.headers.common['Authorization'] =
//         `Bearer ${refreshedToken.accessToken}`;
//
//       // Retry the original request
//       return api(originalRequest);
//     }
//
//     return Promise.reject(error);
//   }
// );

// // This function will handle the token refresh logic
// // You'll need to adjust this to your server's refresh token endpoint and logic
// async function refreshToken(): Promise<{
//   accessToken: string;
//   refreshToken: string;
// }> {
//   const refreshToken = await SecureStore.getItemAsync('refreshUserToken');
//
//   // Make a request to the refresh token endpoint
//   const response = await api.post('/users/refreshToken', { refreshToken });
//
//   // Assuming the new token is returned in the response data
//   return response.data;
// }
