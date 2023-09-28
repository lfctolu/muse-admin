import axios from 'axios';
import Cookies from 'js-cookie';
import { firebaseAuth } from './firebaseClient';
import qs from 'qs';

const baseURL =
  process.env.REACT_APP_API_URL || 'https://api-dev.gyfted.it/api/v1/';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params),
});

const requestInterceptor = (config) => {
  const newConfig = { ...config };

  const accessToken = Cookies.get('accessToken');

  if (!newConfig.headers.Authorization && accessToken) {
    newConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return newConfig;
};

const responseInterceptor = (setAuthAtom) => async (error) => {
  if (error.response?.status === 401) {
    if (firebaseAuth.currentUser) {
      try {
        const accessToken = await firebaseAuth.currentUser.getIdToken(true);
        Cookies.set('accessToken', accessToken);

        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return Promise.resolve(axios(originalRequest));
      } catch (err) {
        setAuthAtom({ isLogged: false });
      }
    }

    setAuthAtom({ isLogged: false });
  }

  return Promise.reject(error);
};

export default apiClient;
export { requestInterceptor, responseInterceptor };
