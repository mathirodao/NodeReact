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

export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/users/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw error;
  }
};

export const getUsersStats = async () => {
    try {
      const response = await api.get('/api/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error in getUsersStats:', error);
      throw error;
    }
  };
  
  export const getFailedLoginStats = async () => {
    try {
      const response = await api.get('/api/users/stats/failed-logins');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de logins fallidos:', error);
      throw error;
    }
  };

  export const getAllUsersDetailed = async () => {
    try {
      const response = await api.get('/api/users/detailed');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios detallados:', error);
      throw error;
    }
  };

  export const updateUser = async (id: string, userData: any) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  };
  
  export const changeUserStatus = async (id: string, status: boolean) => {
    try {
      const response = await api.patch(`/api/users/${id}/status`, { active: status });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      throw error;
    }
  };