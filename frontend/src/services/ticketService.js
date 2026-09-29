import api from './api';

export const getTickets = async (params = {}) => {
  const response = await api.get('/tickets', { params });
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

export const updateTicket = async (id, updateData) => {
  const response = await api.patch(`/tickets/${id}`, updateData);
  return response.data;
};

export const updateTicketStatus = async (id, status) => {
  const response = await api.patch(`/tickets/${id}/status`, { status });
  return response.data;
};

export const assignTicket = async (id, assignedTo) => {
  const response = await api.patch(`/tickets/${id}/assign`, { assignedTo });
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};

export const getTicketComments = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/comments`);
  return response.data;
};

export const createTicketComment = async (ticketId, message) => {
  const response = await api.post(`/tickets/${ticketId}/comments`, { message });
  return response.data;
};

export const getTicketActivity = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/activity`);
  return response.data;
};
