import IAuthRepository from "../../features/auth/data/auth-repository";
import { IMeRepository } from "../../features/user/data/me-repository";

type StoreExtraArg = {
  authRepo: IAuthRepository;
  meRepo: IMeRepository;
};

export default StoreExtraArg;
