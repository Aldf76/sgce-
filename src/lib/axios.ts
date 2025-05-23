// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api", // ajuste para o prefixo correto da sua API
});
