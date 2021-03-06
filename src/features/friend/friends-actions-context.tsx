import { friendsActions } from "./friends-slice";
import React, { useContext } from "react";

export const FriendsActionsContext = React.createContext(friendsActions);

export const useFriendsActions = () => useContext(FriendsActionsContext);

export const FriendsActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <FriendsActionsContext.Provider value={friendsActions}>
      {children}
    </FriendsActionsContext.Provider>
  );
};
