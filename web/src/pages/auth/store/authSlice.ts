import {
  createSelector,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { RootState } from "src/config/store";
import { IUser } from "../types/user.model";
import { getUser } from "./auth.actions";

export const STORAGE_KEY_TOKEN = "TOKEN";

export interface AuthState {
  user: IUser | null;
  token: string | null;
  loadingStatus: {
    authenticating: boolean;
    fetchingUser: boolean;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  loadingStatus: {
    authenticating: false,
    fetchingUser: false,
  },
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loadingStatus.fetchingUser = true;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.loadingStatus.fetchingUser = false;
        state.user = payload;
      });
  },
});

export const { authenticate, unauthenticate } = authSlice.actions;

const selectAuth = (state: RootState) => state.auth;
export const selectUser = createSelector(selectAuth, (state) => state.user);

export default authSlice.reducer;
