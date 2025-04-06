import axios from 'axios';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.API_URL,
  //baseURL: 'http://192.168.1.247:5214/api',
});

// Interceptor để tự động thêm token
api.interceptors.request.use(async (config) => {
  const user = auth().currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }
  
  return config;
});

// Xử lý lỗi 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await auth().currentUser?.getIdToken(true);
        return api(originalRequest);
      } catch (refreshError) {
        await auth().signOut();
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;