import { FriendRequests } from "./types/friend-request";
import FriendError from "./types/friend-error";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkAPI } from "../../core/redux/store";
import { isRight } from "fp-ts/Either";
import Friend from "./types/friend";

export type FriendsState = {
  friends: Friend[] | null;
  friendRequests: FriendRequests | null;
  beingTreated: string[];
  requestsError: FriendError | null;
  friendsError: FriendError | null;
};

export const initialFriendsState: FriendsState = {
  friends: null,
  friendRequests: null,
  beingTreated: [],
  requestsError: null,
  friendsError: null,
};

const removeRequest = (state: FriendsState, userID: string) => {
  const { sent, received } = state.friendRequests!;
  state.friendRequests = {
    sent: sent.filter((r) => r.user.id != userID),
    received: received.filter((r) => r.user.id != userID),
  };
};

const friendsSlice = createSlice({
  name: "friends",
  initialState: initialFriendsState,
  reducers: {
    requestRemoved(state: FriendsState, action: PayloadAction<string>) {
      removeRequest(state, action.payload);
    },
  },
});

export default friendsSlice.reducer;
