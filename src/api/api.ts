import { store } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add interceptors for attaching the token to requests
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.token?.value; // Ensure token is optional-safe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const Login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const LoginUserDetails = async () => {
  try {
    const response = await api.get("/users/me");
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await api.get("/users/all");
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetSingleUser = async (data: { id: number }) => {
  try {
    const response = await api.get(`/users/${data.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteUser = async (data: { id: number }) => {
  try {
    const response = await api.delete(`/users/${data.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await api.post(`/users/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateUser = async (data: {
  id: number;
  username: string;
  email: string;
  role: string;
}) => {
  try {
    const response = await api.patch(`/users/update/${data.id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
