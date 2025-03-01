import { store } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.token?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   Authentication & Users
========================= */

export const Login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const LoginUserDetails = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const GetAllUsers = async () => {
  const response = await api.get("/users/all");
  return response.data;
};

export const GetSingleUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const DeleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const AddUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post("/users/add", data);
  return response.data;
};

export const UpdateUser = async (data: {
  id: number;
  username: string;
  email: string;
  role: string;
}) => {
  const response = await api.patch(`/users/update/${data.id}`, data);
  return response.data;
};

/* =========================
         Brands
========================= */

export const GetAllBrands = async () => {
  const response = await api.get("/brands/all");
  return response.data;
};

export const GetSingleBrand = async (id: number) => {
  const response = await api.get(`/brands/${id}`);
  return response.data;
};

export const AddBrand = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await api.post("/brands/add", data);
  return response.data;
};

export const UpdateBrand = async (data: {
  id: number;
  name: string;
  description: string;
}) => {
  const response = await api.patch(`/brands/update/${data.id}`, data);
  return response.data;
};

/* =========================
       Categories
========================= */

export const GetAllCategories = async () => {
  const response = await api.get("/categories/all");
  return response.data;
};

export const GetSingleCategory = async (id: number) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const AddCategory = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await api.post("/categories/add", data);
  return response.data;
};

export const UpdateCategory = async (data: {
  id: number;
  name: string;
  description: string;
}) => {
  const response = await api.patch(`/categories/update/${data.id}`, data);
  return response.data;
};

/* =========================
          Accounts
========================= */

export const GetAllAccountsHierarchically = async () => {
  const response = await api.get("/account/groups");
  return response.data;
};

export const GetAllAccounts = async () => {
  const response = await api.get("/account/accounts");
  return response.data;
};

export const GetAccountByType = async (accountType: string) => {
  const response = await api.get(
    `/account/accounts/type?accountType=${accountType}`
  );
  return response.data;
};

export const GetAccountById = async (id: string) => {
  const response = await api.get(`/account/${id}`);
  return response.data;
};

/* =========================
          Vouchers
========================= */

export const GetVoucherNo = async (voucherType: string) => {
  const response = await api.get(
    `/voucher/voucher-no?voucherType=${voucherType}`
  );
  return response.data;
};

export const CreateVoucher = async (data: {
  voucherType: string;
  description?: string;
  ledgerEntries: Array<{
    accountId: string;
    transactionType: string;
    amount: number;
    description?: string;
  }>;
}) => {
  // Corrected endpoint from "/categories/add" to "/voucher/add"
  const response = await api.post("/voucher/add", data);
  return response.data;
};

/* =========================
           Ledger
========================= */

export const GetLedgerEntriesByAccountAndDateRange = async (
  accountId: string,
  startDate: string,
  endDate: string
) => {
  if (!accountId || !startDate || !endDate) {
    throw new Error("accountId, startDate, and endDate are required");
  }

  const response = await api.get("/ledger/account-entries", {
    params: { accountId, startDate, endDate },
  });

  return response.data;
};
