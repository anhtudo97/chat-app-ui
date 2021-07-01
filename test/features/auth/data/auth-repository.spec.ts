import { beforeEach, describe, expect, it } from "@jest/globals";
import GoogleAuth from "../../../../src/features/auth/data/sources/google-auth";
import { instance, mock, reset, verify, when } from "ts-mockito";
import { IAuthAPI } from "../../../../src/features/auth/data/sources/auth-api";
import LoginResult from "../../../../src/features/auth/types/login-result";
import IAuthRepository, {
  AuthRepository,
} from "../../../../src/features/auth/data/auth-repository";
import { left, right } from "fp-ts/Either";
import AuthError from "../../../../src/features/auth/types/auth-error";

const token = "token";
const loginResult: LoginResult = {
  accessToken: "access-token",
  displayName: null,
  photoURL: null,
};

const MockGoogleAuth = mock(GoogleAuth);
const MockAuthAPI = mock<IAuthAPI>();

const googleAuth: GoogleAuth = instance(MockGoogleAuth);
const authAPI: IAuthAPI = instance(MockAuthAPI);

const authRepo: IAuthRepository = new AuthRepository(authAPI, googleAuth);

beforeEach(() => {
  reset(MockAuthAPI);
  reset(MockGoogleAuth);
});

describe("leftOrRight", () => {
  it("should return cookies auth error", async () => {
    const result = await (authRepo as AuthRepository).leftOrRight<LoginResult>(
      () => {
        throw { error: AuthRepository.ERROR_COOKIES };
      }
    );
    expect(result).toStrictEqual(left(AuthError.cookiesDisabled));
  });

  it("should return aborted auth error", async () => {
    const result = await (authRepo as AuthRepository).leftOrRight<LoginResult>(
      () => {
        throw { error: AuthRepository.ERROR_ABORTED };
      }
    );
    expect(result).toStrictEqual(left(AuthError.abortedByUser));
  });

  it("should return network auth error", async () => {
    const result = await (authRepo as AuthRepository).leftOrRight<LoginResult>(
      () => {
        throw { error: AuthRepository.ERROR_NETWORK };
      }
    );
    expect(result).toStrictEqual(left(AuthError.network));
  });

  it("should return general auth error", async () => {
    const result = await (authRepo as AuthRepository).leftOrRight<LoginResult>(
      () => {
        throw { error: "yikes" };
      }
    );
    expect(result).toStrictEqual(left(AuthError.general));
  });
});
