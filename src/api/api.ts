import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const Login = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export const LoginUserDetails = async () => {
  return await api.get("/users/me", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic3VmaXlhbnNha2FyaWEyQGdtYWlsLmNvbSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczMzE1NTc4MCwiZXhwIjoxNzM1NzQ3NzgwfQ.q_OQC5ff6WH1Q4C-GRL2GI0QR1_pUIleDIu4_awRDHI`,
    },
  });
};
