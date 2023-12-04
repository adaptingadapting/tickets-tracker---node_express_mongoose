import axios from "axios";

const Api = axios.create({baseURL: "http://localhost:5100/api/clients"});

export const getAllClients = () => Api.get('/');

export const getClientById = (id) => Api.get(`/${id}`);

export const createClient = (client) => Api.post('/', client);

export const deleteClient = (id) => Api.delete(`/${id}`);

export const updateClient = (id, client) => Api.put(`/${id}`, client);
