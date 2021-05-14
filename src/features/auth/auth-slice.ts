import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AuthError from "./types/auth-error";

export type AuthUser = {
  displayName: string | null;
  photoURL: string | null;
};

export type AuthState = {
  initialized: boolean;
  accessToken: string | null;
  authUser: AuthUser | null;
  authError: AuthError | null;
  loading: boolean;
};

const initialState: AuthState = {
  initialized: false,
  accessToken: null,
  authUser: null,
  authError: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken(state: AuthState, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
});

export default authSlice.reducer;
