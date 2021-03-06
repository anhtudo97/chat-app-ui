import { Either, left, right } from "fp-ts/Either";
import FriendError from "../types/friend-error";
import { Friendship, FriendshipInfo } from "../types/friendship";
import { isApolloError } from "@apollo/client";
import { IFriendAPI } from "./sources/friend-api";
import User, { GetUserArgs } from "../../user/types/user";
import { FriendRequest, FriendRequests } from "../types/friend-request";
import Friend from "../types/friend";

export interface IFriendRepository {
  getFriends(): Promise<Either<FriendError, Friend[]>>;

  getFriendRequests(): Promise<Either<FriendError, FriendRequests>>;

  getFriendshipInfo(
    args: GetUserArgs
  ): Promise<Either<FriendError, FriendshipInfo>>;

  sendFriendRequest(userID: string): Promise<Either<FriendError, Friendship>>;

  acceptFriendRequest(userID: string): Promise<Either<FriendError, Friendship>>;

  declineFriendRequest(
    userID: string
  ): Promise<Either<FriendError, Friendship>>;

  cancelFriendRequest(userID: string): Promise<Either<FriendError, Friendship>>;

  unfriend(userID: string): Promise<Either<FriendError, Friendship>>;
}

export const friendErrors = {
  REQUEST_RECEIVED: "REQUEST_RECEIVED",
  REQUEST_REMOVE: "REQUEST_REMOVE",
  ALREADY_FRIENDS: "ALREADY_FRIENDS",
};

export default class FriendRepository implements IFriendRepository {
  private readonly _friendAPI: IFriendAPI;

  constructor(friendAPI: IFriendAPI) {
    this._friendAPI = friendAPI;
  }

  async _leftOrRight<R>(
    work: () => Promise<R>
  ): Promise<Either<FriendError, R>> {
    try {
      const result = await work();
      return right(result);
    } catch (e) {
      if (isApolloError(e)) {
        const code = e.graphQLErrors[0]?.extensions?.code;
        if (!code) {
          // Probably an internet error, not sure
          return left(FriendError.network);
        }
        switch (code) {
          case friendErrors.REQUEST_REMOVE:
            return left(FriendError.requestRemoved);
          case friendErrors.REQUEST_RECEIVED:
            return left(FriendError.requestAlreadyReceived);
          case friendErrors.ALREADY_FRIENDS:
            return left(FriendError.alreadyFriends);
        }
      }
      return left(FriendError.general);
    }
  }

  getFriends(): Promise<Either<FriendError, Friend[]>> {
    return this._leftOrRight(() => this._friendAPI.getFriends());
  }

  getFriendRequests(): Promise<Either<FriendError, FriendRequests>> {
    return this._leftOrRight(() => this._friendAPI.getFriendRequests());
  }

  getFriendshipInfo(
    args: GetUserArgs
  ): Promise<Either<FriendError, FriendshipInfo>> {
    return this._leftOrRight(() => this._friendAPI.getFriendshipInfo(args));
  }

  sendFriendRequest(userID: string): Promise<Either<FriendError, Friendship>> {
    return this._leftOrRight(() => this._friendAPI.sendFriendRequest(userID));
  }

  acceptFriendRequest(
    userID: string
  ): Promise<Either<FriendError, Friendship>> {
    return this._leftOrRight(() => this._friendAPI.acceptFriendRequest(userID));
  }

  declineFriendRequest(
    userID: string
  ): Promise<Either<FriendError, Friendship>> {
    return this._leftOrRight(() =>
      this._friendAPI.declineFriendRequest(userID)
    );
  }

  cancelFriendRequest(
    userID: string
  ): Promise<Either<FriendError, Friendship>> {
    return this._leftOrRight(() => this._friendAPI.cancelFriendRequest(userID));
  }

  unfriend(userID: string): Promise<Either<FriendError, Friendship>> {
    return this._leftOrRight(() => this._friendAPI.unFriend(userID));
  }
}
