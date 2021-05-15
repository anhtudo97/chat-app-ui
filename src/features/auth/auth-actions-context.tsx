import React, { useContext } from "react";
import { authActions } from "./auth-slice";

export const AuthActionContext = React.createContext(authActions);

export const useAuthActions = () => useContext(AuthActionContext);

const AuthActionsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthActionContext.Provider value={authActions}>
      {children}
    </AuthActionContext.Provider>
  );
};

export default AuthActionsProvider;
