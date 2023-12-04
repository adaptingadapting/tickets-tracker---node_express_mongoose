import axios from "axios";

const Api = axios.create({baseURL: "http://localhost:5100/api/"});

export const getAllServices = (id) => Api.get(`clients/${id}/services`);

export const getServiceById = (sid) => Api.get(`/services/${sid}`);

export const createService = (id, service) => Api.post(`clients/${id}/services`, service);

export const deleteService = (sid) => Api.delete(`/services/${sid}`);

export const updateService = (sid, service) => Api.put(`/services/${sid}`, service);

export const toggleActive = (sid) => Api.put(`/services/${sid}/toggleActive`);
