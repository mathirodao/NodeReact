import api from './api';

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data.user;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
};