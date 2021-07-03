import {
  anything,
  deepEqual,
  instance,
  mock,
  reset,
  verify,
  when,
} from "ts-mockito";
import { IChatRepository } from "../../../src/features/chat/data/chat-repository";
import { IFileUtils } from "../../../src/shared/utils/file-utils";
import StoreExtraArg from "../../../src/core/redux/store-extra-arg";
import {
  getMockStore,
  initialMeState,
  mockConversation,
  mockMe,
  mockMedia,
  mockMessage,
  mockTheDate,
  mockTyping,
  mockTypingInput,
} from "../../mock-objects";
import { AppState, AppStore } from "../../../src/core/redux/store";
import reducer, {
  _handleRejected,
  chatActions,
  ChatState,
  initialChatState,
} from "../../../src/features/chat/chat-slice";
import { left, right } from "fp-ts/Either";
import ChatError from "../../../src/features/chat/types/chat-error";
import { PayloadAction } from "@reduxjs/toolkit";
import Conversation from "../../../src/features/chat/types/conversation";
import {
  MESSAGES_PER_FETCH,
  SendMessageInput,
} from "../../../src/features/chat/data/sources/chat-api";
import Message, { MessageSub } from "../../../src/features/chat/types/message";
import Observable from "zen-observable";
import { waitFor } from "@testing-library/react";
import Typing, { TypingInput } from "../../../src/features/chat/types/typing";
import { MockStore } from "redux-mock-store";

const MockChatRepo = mock<IChatRepository>();
const MockFileUtils = mock<IFileUtils>();
const MockStore = getMockStore();
let mockStore = MockStore({
  chat: initialChatState,
  me: { ...initialMeState, me: mockMe },
} as AppState);

const chatError = ChatError.network;
const [spy, mockDate] = mockTheDate();

const extra = {
  chatRepo: instance(MockChatRepo),
  fileUtils: instance(MockFileUtils),
} as StoreExtraArg;

beforeEach(() => {
  reset(MockChatRepo);
  reset(MockFileUtils);
  mockStore = MockStore({
    chat: initialChatState,
    me: { ...initialMeState, me: mockMe },
  } as AppState);
});

afterAll(() => {
  spy.mockRestore();
});

describe("general purpose reducers", () => {
  describe("_handleRejected", () => {
    it("should return the right state if the error is undefined", () => {
      // arrange
      const inputState: ChatState = { ...initialChatState };
      const outputState: ChatState = {
        ...inputState,
        error: ChatError.general,
      };
      const action: PayloadAction<undefined> = {
        type: "any",
        payload: undefined,
      };
      // act
      _handleRejected(inputState, action);
      // assert
      expect(inputState).toStrictEqual(outputState);
    });
    it("should return the right state if the error is defined", () => {
      // arrange
      const inputState: ChatState = { ...initialChatState };
      const outputState: ChatState = { ...inputState, error: chatError };
      const action: PayloadAction<ChatError> = {
        type: "any",
        payload: chatError,
      };
      // act
      _handleRejected(inputState, action);
      // assert
      expect(inputState).toStrictEqual(outputState);
    });
  });
});

describe("getConversations", () => {
  const act = (store: AppStore = mockStore) =>
    chatActions.getConversations()(store.dispatch, store.getState, extra);

  it("should return the right state when fulfilled", async () => {
    // arrange
    when(MockChatRepo.getConversations()).thenResolve(
      right([mockConversation])
    );
    // act
    const result = await act();
    // assert
    expect(result.type).toBe(chatActions.getConversations.fulfilled.type);
    expect(result.payload).toStrictEqual([mockConversation]);
    verify(MockChatRepo.getConversations()).once();
    verify(
      MockChatRepo.messagesDelivered(deepEqual([mockConversation.id]))
    ).once();
  });

  it("should return the right state when rejected", async () => {
    // arrange
    when(MockChatRepo.getConversations()).thenResolve(left(chatError));
    // act
    const result = await act();
    // assert
    expect(result.type).toBe(chatActions.getConversations.rejected.type);
    expect(result.payload).toBe(chatError);
    verify(MockChatRepo.getConversations()).once();
  });

  describe("reducers", () => {
    it("should return the right state if pending", () => {
      // arrange
      const inputState: ChatState = { ...initialChatState, error: chatError };
      const outputState: ChatState = { ...inputState, error: null };
      const action: PayloadAction<undefined> = {
        type: chatActions.getConversations.pending.type,
        payload: undefined,
      };
      // act
      const result = reducer(inputState, action);
      // assert
      expect(result).toStrictEqual(outputState);
    });

    it("should return the right state if fulfilled", () => {
      // arrange
      const inputState: ChatState = { ...initialChatState };
      const outputState: ChatState = {
        ...inputState,
        conversations: [mockConversation],
        hasMore: {
          [mockConversation.id]: false,
        },
        lastSeen: {
          [mockConversation.id]: {
            [mockConversation.messages[0].senderID]:
              mockConversation.messages[1].id,
            [mockConversation.messages[1].senderID]:
              mockConversation.messages[1].id,
          },
        },
      };
      const action: PayloadAction<Conversation[]> = {
        type: chatActions.getConversations.fulfilled.type,
        payload: [mockConversation],
      };
      // act
      const result = reducer(inputState, action);
      // assert
      expect(result).toStrictEqual(outputState);
    });
  });
});

describe("getOrCreateOTOConversation", () => {
  const { getOrCreateOTOConversation } = chatActions;
  const userID = "userIIIIID";
  const act = (store: AppStore = mockStore) =>
    getOrCreateOTOConversation(userID)(store.dispatch, store.getState, extra);

  it("should return the right state if fulfilled", async () => {
    // arrange
    when(MockChatRepo.getOrCreateOneToOneConversation(anything())).thenResolve(
      right(mockConversation)
    );
    // act
    const result = await act();
    // assert
    expect(result.type).toBe(getOrCreateOTOConversation.fulfilled.type);
    expect(result.payload).toStrictEqual(mockConversation);
    verify(MockChatRepo.getOrCreateOneToOneConversation(userID)).once();
    verify(
      MockChatRepo.messagesDelivered(deepEqual([mockConversation.id]))
    ).once();
  });

  it("should return the right state if rejected", async () => {
    // arrange
    when(MockChatRepo.getOrCreateOneToOneConversation(anything())).thenResolve(
      left(chatError)
    );
    // act
    const result = await act();
    // assert
    expect(result.type).toBe(getOrCreateOTOConversation.rejected.type);
    expect(result.payload).toStrictEqual(chatError);
    verify(MockChatRepo.getOrCreateOneToOneConversation(userID)).once();
  });

  describe("reducers", () => {
    describe("should return the right state if fulfilled", () => {
      const hasMore = { [mockConversation.id]: false };
      const lastSeen = {
        [mockConversation.id]: {
          [mockConversation.messages[0].senderID]:
            mockConversation.messages[1].id,
          [mockConversation.messages[1].senderID]:
            mockConversation.messages[1].id,
        },
      };

      it("when conversations is null", () => {
        // arrange
        const inputState: ChatState = { ...initialChatState };
        const outputState: ChatState = {
          ...inputState,
          conversations: [mockConversation],
          hasMore,
          lastSeen,
        };
        const action: PayloadAction<Conversation> = {
          type: getOrCreateOTOConversation.fulfilled.type,
          payload: mockConversation,
        };
        // act
        const result = reducer(inputState, action);
        // assert
        expect(result).toStrictEqual(outputState);
      });
      it("when conversations is not null, but does not contain the received conversation", () => {
        // arrange
        const inputState: ChatState = {
          ...initialChatState,
          conversations: [{ ...mockConversation, id: 1234567890 }],
        };
        const outputState: ChatState = {
          ...inputState,
          conversations: [mockConversation, ...inputState.conversations!],
          hasMore,
          lastSeen,
        };
        const action: PayloadAction<Conversation> = {
          type: getOrCreateOTOConversation.fulfilled.type,
          payload: mockConversation,
        };
        // act
        const result = reducer(inputState, action);
        // assert
        expect(result).toStrictEqual(outputState);
      });
      it("when conversations is not null, and contains the received conversation", () => {
        // arrange
        const inputState: ChatState = {
          ...initialChatState,
          conversations: [
            { ...mockConversation, id: 1234567890 },
            { ...mockConversation, messages: [] },
            { ...mockConversation, id: 123456789011 },
          ],
        };
        const outputState: ChatState = { ...inputState };
        const action: PayloadAction<Conversation> = {
          type: getOrCreateOTOConversation.fulfilled.type,
          payload: mockConversation,
        };
        // act
        const result = reducer(inputState, action);
        // assert
        expect(result).toStrictEqual(outputState);
      });
    });
  });
});
