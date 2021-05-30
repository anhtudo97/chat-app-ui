import IAuthRepository from "../../features/auth/data/auth-repository";
import { IMeRepository } from "../../features/user/data/me-repository";
import { IFriendRepository } from "../../features/friend/data/friend-repository";
import { IChatRepository } from "../../features/chat/data/chat-repository";
import { IBadgeRepository } from "../../features/badge/data/badge-repository";
import { ISearchRepository } from "../../features/search/data/search-repository";
import { IBlockRepository } from "../../features/block/data/block-repository";
import { IFileUtils } from "../../shared/utils/file-utils";

type StoreExtraArg = {
  authRepo: IAuthRepository;
  badgeRepo: IBadgeRepository;
  meRepo: IMeRepository;
  friendRepo: IFriendRepository;
  searchRepo: ISearchRepository;
  chatRepo: IChatRepository;
  blockRepo: IBlockRepository;
  fileUtils: IFileUtils;
};

export default StoreExtraArg;
