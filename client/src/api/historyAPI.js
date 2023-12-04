import axios from "axios";

const Api = axios.create({baseURL: "http://localhost:5100/api/history"});

export const getHistory = () => Api.get("/");
