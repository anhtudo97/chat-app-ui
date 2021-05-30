import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Badge, BadgeName } from "./types/badge";
import { ThunkAPI } from "../../core/redux/store";
import BadgeError from "./types/badge-error";
import { isRight } from "fp-ts/Either";

export type BadgeState = {
  notifications: number | null;
  friendRequests: number | null;
};

export const initialBadgeState: BadgeState = {
  notifications: null,
  friendRequests: null,
};

const badgeSlice = createSlice({
  name: "badge",
  initialState: initialBadgeState,
  reducers: {},
});

export default badgeSlice.reducer;
