import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import authReducer from "../../features/auth/auth-slice";
import meReducer from "../../features/user/me-slice";
import friendProfileReducer from "../../features/friend/friend-profile-slice";
import friendsReducer from "../../features/friend/friends-slice";
import chatReducer from "../../features/chat/chat-slice";
import blockReducer from "../../features/block/block-slice";
import searchReducer from "../../features/search/search-slice";

import StoreExtraArg from "./store-extra-arg";

const rootReducer = combineReducers({
  auth: authReducer,
  block: blockReducer,
  me: meReducer,
  friendProfile: friendProfileReducer,
  friends: friendsReducer,
  chat: chatReducer,
  search: searchReducer,
});

const createStore = (services: StoreExtraArg) => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      thunk: { extraArgument: services },
    }),
  });
};

export type AppStore = ReturnType<typeof createStore>;

export type AppState = ReturnType<typeof rootReducer>;

export type AppDispatch = AppStore["dispatch"];

export type ThunkAPI<RejectType> = {
  dispatch: AppDispatch;
  state: AppState;
  extra: StoreExtraArg;
  rejectValue: RejectType;
};

export default createStore;
