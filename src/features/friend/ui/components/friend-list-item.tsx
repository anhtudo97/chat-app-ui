import React, { useCallback } from "react";
import User from "../../../user/types/user";
import { ListItem, ListItemText, makeStyles } from "@material-ui/core";
import Friend from "../../types/friend";
import { FriendAvatar } from "./friend-avatar";

export type FriendListItemProps = {
  friend: Friend;
  style?: React.CSSProperties;
  onClick?: (user: User) => void;
};

const useStyles = makeStyles({
  item: {
    position: "relative",
    minHeight: "72px",
  },
  actions: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
  },
  clear: {
    color: "red",
  },
  check: {
    color: "green",
  },
});

export const FriendListItem: React.FC<FriendListItemProps> = ({
  friend,
  style,
  onClick,
}) => {
  const user = friend.user;

  const onItemClicked = useCallback(() => {
    if (onClick) onClick(user);
  }, []);

  const classes = useStyles();

  return (
    <div style={style} data-testid="friend-list-item">
      <ListItem className={classes.item} onClick={onItemClicked} button>
        <FriendAvatar
          src={friend.user.photo?.small}
          lastSeen={friend.lastSeen}
        />
        <ListItemText primary={user.username} secondary={user.name} />
      </ListItem>
    </div>
  );
};
