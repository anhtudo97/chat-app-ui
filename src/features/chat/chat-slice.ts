import Conversation from "./types/conversation";
import ChatError from "./types/chat-error";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkAPI } from "../../core/redux/store";
import { isRight } from "fp-ts/Either";
import { MESSAGES_PER_FETCH, SendMessageInput } from "./data/sources/chat-api";
import Message from "./types/message";
import { Media } from "./types/media";
import Typing, { TypingInput } from "./types/typing";

export type ChatState = {
  conversations: Conversation[] | null;
  typing: { [conversationID: number]: string[] };
  hasMore: { [conversationID: number]: boolean };

  // conversationID -> userID -> last seen messageID
  lastSeen: { [conversationID: number]: { [userID: string]: number } };
  error: ChatError | null;
};

export const initialChatState: ChatState = {
  conversations: null,
  typing: {},
  hasMore: {},
  lastSeen: {},
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    appendMessage(
      state: ChatState,
      action: PayloadAction<{ message: Message; update?: boolean }>
    ) {
      const { message } = action.payload;

      const index = state.conversations!.findIndex(
        (c) => c.id === message.conversationID
      );
      const conv = state.conversations![index];
      const mIndex = conv.messages.findIndex((m) => m.id === message.id);
      const sb = message.seenBy[0];
      if (sb && state.lastSeen[conv.id][sb.userID] < message.id)
        state.lastSeen[conv.id][sb.userID] = message.id;

      if (mIndex !== -1) conv.messages[mIndex] = message;
      else {
        conv.messages.push(message);
        state.conversations!.splice(index, 1);
        state.conversations!.unshift(conv);
        state.lastSeen[conv.id][message.senderID] = message.id;
      }
    },
    addTying(state: ChatState, action: PayloadAction<Typing>) {
      const { conversationID, userID } = action.payload;
      const typings = state.typing[conversationID];

      if (typings) {
        state.typing[conversationID] = typings.filter((id) => id !== userID);
      }
    },
    recentMessagesSeen(
      state: ChatState,
      action: PayloadAction<{ convID: number; userID: string }>
    ) {
      const { convID, userID } = action.payload;
      const conv = state.conversations!.find((c) => c.id === convID);
      const messages = conv!.messages;
      let idx = messages.length - 1;
      if (idx < 0) return;
      state.lastSeen[convID][userID] = messages[idx].id;
      while (
        idx >= 0 &&
        messages[idx].senderID !== userID &&
        !messages[idx].seenBy[0]
      ) {
        messages[idx].seenBy[0] = { userID, date: new Date().getTime() };
        idx--;
      }
    },
  },
});

export default chatSlice.reducer;
