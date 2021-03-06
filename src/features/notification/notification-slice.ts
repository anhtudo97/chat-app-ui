import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Notification } from "./types/notification";
import { ThunkAPI } from "../../core/redux/store";
import NotificationError from "./types/notification-error";
import { isRight } from "fp-ts/Either";

export type NotificationState = {
  notifications: Notification[] | null;
  error: NotificationError | null;
};

export const initialNotificationState: NotificationState = {
  notifications: null,
  error: null,
};

const getNotifications = createAsyncThunk<
  Notification[],
  void,
  ThunkAPI<NotificationError>
>("notification/getNotifications", async (_, thunkAPI) => {
  const result = await thunkAPI.extra.notificationRepo.getNotifications();
  if (isRight(result)) return result.right;
  return thunkAPI.rejectWithValue(result.left);
});

const markNotificationAsSeen = createAsyncThunk<
  boolean,
  number,
  ThunkAPI<NotificationError>
>("notification/markNotificationAsSeen", async (notificationID, thunkAPI) => {
  const result = await thunkAPI.extra.notificationRepo.markNotificationAsSeen(
    notificationID
  );
  if (isRight(result)) return result.right;
  return thunkAPI.rejectWithValue(result.left);
});

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {},
  extraReducers: (builder) => {
    // getNotifications
    builder
      .addCase(getNotifications.pending, (state) => {
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        if (action.payload != undefined) state.error = action.payload;
        else state.error = NotificationError.general;
      });
    // markNotificationAsSeen
    builder.addCase(markNotificationAsSeen.pending, (state, action) => {
      state.notifications = state.notifications!.map((n) => {
        if (action.meta.arg == n.id) return { ...n, seen: true };
        return n;
      });
    });
  },
});

export default notificationSlice.reducer;

export const notificationActions = {
  getNotifications,
  markNotificationAsSeen,
  ...notificationSlice.actions,
};
