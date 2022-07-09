import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../auth.api";
import { authenticate } from "./authSlice";

export interface LoginDto {
  email: string;
  password: string;
}
export const login = createAsyncThunk(
  "auth/login",
  async (loginDto: LoginDto, { dispatch }) => {
    const { access_token } = await authApi.login(loginDto);
    dispatch(authenticate({ token: access_token }));
    dispatch(getUser());
  }
);

export const getUser = createAsyncThunk("me", async () => {
  return await authApi.me();
});
