import axios from "axios";
import { lireJetonCourant } from "@/lib/api/acces-jeton";

export const apiCliente = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiCliente.interceptors.request.use((config) => {
  const jeton = lireJetonCourant();
  if (jeton) {
    config.headers.Authorization = `Bearer ${jeton}`;
  }
  return config;
});
