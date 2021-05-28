import { Avatar, Badge, ListItemAvatar, makeStyles } from "@material-ui/core";
import React from "react";
import { formatDate } from "../../../../shared/utils/date-utils";

export type FriendAvatarProps = {
  src: string | undefined;
  lastSeen?: number;
  className?: string;
};

const useStyles = makeStyles({
  dot: {
    "& .MuiBadge-badge": {
      background: "#5dda4e",
      color: "white",
    },
    "& .MuiBadge-dot": {
      border: "1px solid white",
      borderRadius: "50%",
      height: "14px",
      width: "14px",
      margin: "5px",
    },
  },
  badge: {
    "& .MuiBadge-badge": {
      background: "#317529",
      color: "white",
      fontSize: "0.5rem",
      border: "1px solid white",
      margin: "2px",
    },
  },
});

export const FriendAvatar: React.FC<FriendAvatarProps> = ({
  src,
  lastSeen,
  className,
}) => {
  const classes = useStyles();

  let online = false;
  let lastSeenTime: string | undefined;
  if (lastSeen) {
    online = new Date().getTime() - lastSeen <= 65000;
    lastSeenTime = formatDate(lastSeen, "mini");
  }

  return (
    <ListItemAvatar>
      <Badge
        variant={online ? "dot" : "standard"}
        badgeContent={lastSeenTime}
        invisible={!online && !lastSeenTime}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        className={online ? classes.dot : classes.badge}
      >
        <Avatar className={className} src={src} alt="friend-avatar" />
      </Badge>
    </ListItemAvatar>
  );
};
