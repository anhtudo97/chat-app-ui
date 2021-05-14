import IAuthRepository from "../../features/auth/data/auth-repository";

type StoreExtraArg = {
  authRepo: IAuthRepository;
};

export default StoreExtraArg;
