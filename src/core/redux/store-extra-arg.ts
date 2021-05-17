import IAuthRepository from "../../features/auth/data/auth-repository";
import { IMeRepository } from "../../features/user/data/me-repository";
import { IFriendRepository } from "../../features/friend/data/friend-repository";

type StoreExtraArg = {
  authRepo: IAuthRepository;
  meRepo: IMeRepository;

  friendRepo: IFriendRepository;
};

export default StoreExtraArg;
