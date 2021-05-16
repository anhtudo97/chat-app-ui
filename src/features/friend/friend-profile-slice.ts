import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../user/types/user";
import {
  Friendship,
  FriendshipInfo,
  FriendshipStatus,
} from "./types/friendship";
import FriendError from "./types/friend-error";

export type FriendProfileState = {
  user: User | null;
  friendship: Friendship | null;
  loading: boolean;
  modifyingFriendship: boolean;
  error: FriendError | null;
};

export const initialFriendProfileState: FriendProfileState = {
  user: null,
  friendship: null,
  loading: false,
  modifyingFriendship: false,
  error: null,
};

const friendProfileSlice = createSlice({
  name: "friendProfile",
  initialState: initialFriendProfileState,
  reducers: {
    reset: () => initialFriendProfileState,
  },
});

export default friendProfileSlice.reducer;
