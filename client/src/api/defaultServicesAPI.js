import axios from "axios";

const Api = axios.create({baseURL: "http://localhost:5100/api/defaultservices"});

export const getAllDServices = () => Api.get(`/`);

export const createDService = (service) => Api.post(`/`, service);

export const deleteDService = (sid) => Api.delete(`/${sid}`);

export const updateDService = (sid, service) => Api.put(`/${sid}`, service);
