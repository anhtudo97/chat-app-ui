import React, { useContext } from "react";
import { meActions } from "./me-slice";

export const MeActionsContext = React.createContext(meActions);

export const useMeActions = () => useContext(MeActionsContext);

export const MeActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MeActionsContext.Provider value={meActions}>
      {children}
    </MeActionsContext.Provider>
  );
};
