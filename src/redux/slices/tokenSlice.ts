import { createSlice } from "@reduxjs/toolkit";

const initialToken = sessionStorage.getItem("token") || "";

export const TokenSlice = createSlice({
  name: "Token",
  initialState: {
    value: initialToken,
  },
  reducers: {
    setToken: (state, action) => {
      state.value = action.payload;
      sessionStorage.setItem("token", action.payload); // Save token to sessionStorage
    },
    clearToken: (state) => {
      state.value = "";
      sessionStorage.removeItem("token"); // Remove token from sessionStorage
    },
  },
});

export const { setToken, clearToken } = TokenSlice.actions;

export default TokenSlice.reducer;
