import { Block } from "../types/block";
import { Either, left, right } from "fp-ts/Either";
import BlockError from "../types/block-error";
import { isApolloError } from "@apollo/client";
import { IBlockAPI } from "./sources/block-api";

export interface IBlockrRepository {
  block(blockedID: string): Promise<Either<BlockError, Block>>;

  unblock(blockedID: string): Promise<Either<BlockError, string>>;

  getBlockedUsers(): Promise<Either<BlockError, Block[]>>;
}

export default class BlockRepository implements IBlockrRepository {
  private readonly _blockAPI: IBlockAPI;

  constructor(blockAPI: IBlockAPI) {
    this._blockAPI = blockAPI;
  }

  async block(blockedID: string): Promise<Either<BlockError, Block>> {
    return this._leftOrRight(() => this._blockAPI.block(blockedID));
  }

  async unblock(blockedID: string): Promise<Either<BlockError, string>> {
    return this._leftOrRight(() => this._blockAPI.unblock(blockedID));
  }

  async getBlockedUsers(): Promise<Either<BlockError, Block[]>> {
    return this._leftOrRight(() => this._blockAPI.getBlockedUsers());
  }

  async _leftOrRight<R>(
    work: () => Promise<R>
  ): Promise<Either<BlockError, R>> {
    try {
      const result = await work();
      return right(result);
    } catch (error) {
      console.log(`Block repository THREW: ${JSON.stringify(error)}`);
      if (isApolloError(error)) {
        const code = error.graphQLErrors[0]?.extensions?.code;
        if (!code) return left(BlockError.network);
      }
      return left(BlockError.general);
    }
  }
}
