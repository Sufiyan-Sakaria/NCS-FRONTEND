import { store } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.token.value;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return error;
  }
);

export const Login = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export const LoginUserDetails = async () => {
  return await api.get("/users/me");
};

export const Users = async () => {
  return await api.get("/users/all");
};
