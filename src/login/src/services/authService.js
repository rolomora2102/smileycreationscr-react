import api from './api';

// Función para guardar el token de forma segura
export const storeToken = (token) => {
    if (process.env.NODE_ENV === 'production') {
      document.cookie = `token=${token}; path=/; Secure; HttpOnly; SameSite=none`;
    } else {
      localStorage.setItem('adminToken', token);
    }
  };
  
  // Función para obtener el token
export const getToken = () => {
    if (process.env.NODE_ENV === 'production') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
    } else {
      return localStorage.getItem('adminToken');
    }
  };

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  storeToken(response.data.token);
  return response.data.token;
};

export const verifyToken = async () => {
    const response = await api.get('/login/verify-token');
    return response.data.isAdmin;
};