import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/config/store";
import { IUser } from "../types/user.model";
import { getUser, signup } from "./auth.actions";

export const STORAGE_KEY_TOKEN = "TOKEN";

export interface AuthState {
  user: IUser | null;
  token: string | null;
  loadingStatus: {
    authenticating: boolean;
    fetchingUser: boolean;
  };
  error: string | null
  accountCreated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loadingStatus: {
    authenticating: false,
    fetchingUser: false,
  },
  error: null,
  accountCreated: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate(state, action: PayloadAction<{ token: string }>) {
      const { token } = action.payload;

      localStorage.setItem(STORAGE_KEY_TOKEN, token);

      state.token = token;
    },
    unauthenticate(state) {
      localStorage.removeItem(STORAGE_KEY_TOKEN);

      state.token = null;
      state.user = null;
    },
    clearError(state) {
      state.error = null;
      state.accountCreated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loadingStatus.authenticating = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loadingStatus.authenticating = false;
        state.accountCreated = true
        state.error = null
      })
      .addCase(signup.rejected, (state, action: any) => {
        state.error = action.error?.message;
      })
      .addCase(getUser.pending, (state) => {
        state.loadingStatus.fetchingUser = true;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.loadingStatus.fetchingUser = false;
        state.user = payload;
      });
  },
});

export const { authenticate, unauthenticate, clearError } = authSlice.actions;

const selectAuth = (state: RootState) => state.auth;
export const selectUser = createSelector(selectAuth, (state) => state.user);
export const selectAuthError = createSelector(selectAuth, (state) => state.error);
export const selectAccountCreated = createSelector(selectAuth, (state) => state.accountCreated);

export default authSlice.reducer;
