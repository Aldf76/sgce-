// Importa a biblioteca Axios, usada para fazer chamadas HTTP (GET, POST, etc.)
import axios from "axios";

// Cria uma instância customizada do Axios, chamada `api`
export const api = axios.create({
  baseURL: "http://localhost:8080/api", // ajuste para o endereço e prefixo real da sua API
});
