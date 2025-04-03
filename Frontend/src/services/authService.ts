import api from './api';

// Login
export const login = async (identifier: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { identifier, password });
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

// Logout
export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Verificar Sesión
export const verifySession = async () => {
  try {
    const response = await api.get('/api/auth/verify-session');
    return response.data;
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    throw error;
  }
};

export const getFailedLoginStats = async () => {
    try {
      const response = await api.get('/api/auth/failed-logins');
      return response.data;
    } catch (error) {
      console.error('Error in getFailedLoginStats:', error);
      throw error;
    }
  };