import IAuthRepository from "../../features/auth/data/auth-repository";
import { IMeRepository } from "../../features/user/data/me-repository";
import { IFriendRepository } from "../../features/friend/data/friend-repository";
import { IChatRepository } from "../../features/chat/data/chat-repository";

import { IFileUtils } from "../../shared/utils/file-utils";

type StoreExtraArg = {
  authRepo: IAuthRepository;
  meRepo: IMeRepository;
  friendRepo: IFriendRepository;
  chatRepo: IChatRepository;

  fileUtils: IFileUtils;
};

export default StoreExtraArg;
