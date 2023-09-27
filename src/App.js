import { useEffect, useRef, useState } from 'react';
import Router from './router';
import apiClient, {
  requestInterceptor,
  responseInterceptor,
} from 'api/axiosClient';
import { useSetAtom } from 'jotai';
import { authAtom } from 'atoms';
import './App.css';

function App() {
  const setAuthAtom = useSetAtom(authAtom);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const reqInterceptor = apiClient.interceptors.request.use(
      requestInterceptor,
      (error) => Promise.reject(error)
    );

    const resInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      responseInterceptor(setAuthAtom)
    );

    setIsConfigured(true);

    return () => {
      apiClient.interceptors.request.eject(reqInterceptor);
      apiClient.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return isConfigured && <Router />;
}

export default App;
