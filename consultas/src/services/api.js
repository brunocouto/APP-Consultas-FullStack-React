import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Ajuste para a URL da sua API
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@ConsultasApp:token');
      localStorage.removeItem('@ConsultasApp:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
