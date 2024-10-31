import api from './api';

export const getClients = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await api.post('/clientes', clientData);
  return response.data;
};

export const updateClient = async (clientId, clientData) => {
  const response = await api.put(`/clientes/${clientId}`, clientData);
  return response.data;
};

export const deleteClient = async (clientId) => {
  const response = await api.delete(`/clientes/${clientId}`);
  return response.data;
};
