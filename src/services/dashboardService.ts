import axios from "axios";
import { api } from "@/lib/axios";

// busca dados da api para completar o dashboard
export async function buscarMetricasDashboard() {
  const response = await api.get("/dashboard");
  return response.data;
}