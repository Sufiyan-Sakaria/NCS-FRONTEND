import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const Login = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};
