import { FriendRequest } from "../../types/friend-request";
import React, { useCallback } from "react";
import User from "../../../user/types/user";
import {
  Avatar,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  makeStyles,
} from "@material-ui/core";
import { PulseLoader } from "react-spinners";
import { formatDate } from "../../../../shared/utils/date-utils";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

export type RequestListItemProps = {
  req: FriendRequest;
  style?: React.CSSProperties;
  received?: boolean | undefined;
  loading?: boolean;
  onClick?: (user: User) => void;
  onAccept?: (user: User) => void;
  onCancel?: (user: User) => void;
};

const useStyles = makeStyles<Theme, { received?: boolean | undefined }>({
  outer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  item: {
    height: "72px",
  },
  actions: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "8px",
  },
  button: {
    padding: "5px",
    margin: "2px",
  },
  clear: {
    color: "red",
  },
  check: {
    color: "green",
  },
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
  listItemText: (props) => ({
    display: "flex",
    flexDirection: "column",
    maxWidth: props.received ? "50%" : "60%",
  }),
  primaryText: {
    color: "black",
    fontSize: "1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingBottom: "8px",
  },
  secondaryText: {
    color: "#808080",
    fontSize: "0.875rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export const RequestListItem: React.FC<RequestListItemProps> = ({
  req,
  style,
  received,
  loading,
  onClick,
  onCancel,
  onAccept,
}) => {
  const classes = useStyles({ received });
  const user = req.user;

  const onClicked = useCallback(() => {
    if (onClick) onClick(user);
  }, [onClick]);

  const onAccepted = useCallback(() => {
    if (onAccept) onAccept(user);
  }, [onClick]);

  const onCanceled = useCallback(() => {
    if (onCancel) onCancel(user);
  }, [onClick]);

  return (
    <div className={classes.outer} data-testid="request-list-item">
      <ListItem className={classes.item} onClick={onClicked} button>
        <ListItemAvatar>
          <Avatar src={user.photo?.small ?? ""} alt="request-avatar" />
        </ListItemAvatar>
        <div className={classes.listItemText}>
          <div className={classes.primaryText}>{user.username}</div>
          <div className={classes.secondaryText}>{formatDate(req.date)}</div>
        </div>
      </ListItem>
      <div className={classes.actions} data-testid="request-actions">
        {loading && (
          <span data-testid="request-loading">
            <PulseLoader size={10} color="grey" />
          </span>
        )}
        {!loading && (
          <IconButton
            className={classes.button}
            onClick={onCanceled}
            aria-label="Cancel"
            data-testid="cancel-request"
          >
            <Icon className={classes.clear}>clear</Icon>
          </IconButton>
        )}

        {!loading && received && (
          <IconButton
            className={classes.button}
            onClick={onAccepted}
            aria-label="Accept"
            data-testid="accept-request"
          >
            <Icon className={classes.check}>check</Icon>
          </IconButton>
        )}
      </div>
    </div>
  );
};
