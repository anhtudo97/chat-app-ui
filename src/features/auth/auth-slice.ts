import { ThunkAPI } from "./../../core/redux/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AuthError from "./types/auth-error";
import { isRight } from "fp-ts/Either";
import LoginResult from "./types/login-result";

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

const getAccessToken = createAsyncThunk<string, void, ThunkAPI<AuthError>>(
  "auth/getAccessToken",
  async (_, thunkApi) => {
    const result = await thunkApi.extra.authRepo.getAccessToken();
    if (isRight(result)) return result.right;
    return thunkApi.rejectWithValue(result.left);
  }
);

const signInWithGoogle = createAsyncThunk<
  LoginResult,
  void,
  ThunkAPI<AuthError>
>("auth/signInWithGoogle", async (_, thunkApi) => {
  const result = await thunkApi.extra.authRepo.signInWithGoogle();
  if (isRight(result)) {
    return result.right;
  }
  return thunkApi.rejectWithValue(result.left);
});

const signOut = createAsyncThunk<null, void, ThunkAPI<AuthError>>(
  "auth/signOut",
  async (_, thunkApi) => {
    const result = await thunkApi.extra.authRepo.signOut();
    if (isRight(result)) {
      location.reload();
      return result.right;
    }
    return thunkApi.rejectWithValue(result.left);
  }
);

const handlePending = (state: AuthState) => {
  state.authError = null;
  state.loading = true;
};

const handleReject = (state: AuthState, error: AuthError | undefined) => {
  state.loading = false;
  if (error) state.authError = error;
  else state.authError = AuthError.general;
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken(state: AuthState, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // getAccessToken
    builder
      .addCase(getAccessToken.pending, (state) => {
        handlePending(state);
      })
      .addCase(getAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(getAccessToken.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === AuthError.unauthenticated) {
          state.initialized = true;
        } else {
          handleReject(state, action.payload);
        }
      });
    // signInWithGoogle
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        handlePending(state);
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        const result = action.payload;
        state.loading = false;
        state.authUser = {
          displayName: result.displayName,
          photoURL: result.photoURL,
        };
        state.accessToken = result.accessToken ?? null;
        state.initialized = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        handleReject(state, action.payload);
      });

    // signOut
    builder
      .addCase(signOut.pending, (state) => {
        handlePending(state);
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.accessToken = null;
        state.authUser = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        handleReject(state, action.payload);
      });
  },
});

export const authActions = {
  getAccessToken,
  signInWithGoogle,
  signOut,
  ...authSlice.actions,
};

export default authSlice.reducer;
