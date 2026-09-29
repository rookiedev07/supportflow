import api from './api';

export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id, updateData) => {
  const response = await api.patch(`/users/${id}`, updateData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getAssignees = async () => {
  const response = await api.get('/users/assignees');
  return response.data;
};
