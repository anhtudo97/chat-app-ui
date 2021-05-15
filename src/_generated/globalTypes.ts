/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface LoginInput {
  token: string;
}

export interface UserCreation {
  name?: string | null;
  photo?: any | null;
  username: string;
}

export interface UserUpdate {
  deleteName?: boolean | null;
  deletePhoto?: boolean | null;
  name?: string | null;
  photo?: any | null;
  username?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
