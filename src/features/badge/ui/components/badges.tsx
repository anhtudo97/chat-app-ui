import {
  Badge,
  Icon,
  IconButton,
  makeStyles,
  Popover,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../../core/redux/hooks";
import { NotificationsScreen } from "../../../notification/ui/notifications-screen";
import { useMobileMQ } from "../../../../shared/styles/media-query";

const useStyles = makeStyles({
  button: {
    color: "black",
    padding: 6,
    margin: 6,
    "& .material-icons": {
      fontSize: "1.8rem",
    },
  },
  badge: {
    "& .MuiBadge-badge": {
      background: "red",
      color: "white",
    },
  },
  menu: {
    display: "flex",
    width: "360px",
    height: "400px",
    minHeight: "500px",
  },
});

export const Badges = () => {
  const badgeState = useAppSelector((state) => state.badge);
  const friendRequests = useAppSelector(
    (state) => state.friends.friendRequests
  );
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  const [requestCount, setRequestCount] = useState(0);
  const [notiCount, setNotiCount] = useState(0);
  const history = useHistory();
  const [notiAnchor, setNotiAnchor] = useState<HTMLButtonElement | null>(null);
  const isMobile = useMobileMQ();
  const classes = useStyles();

  useEffect(() => {
    if (!badgeState.friendRequests || !friendRequests) {
      setRequestCount(0);
    } else {
      let count = 0;
      const reqs = friendRequests.received;
      for (const req of reqs) {
        if (req.date < badgeState.friendRequests) break;
        count++;
      }
    }
  }, [badgeState, friendRequests]);

  useEffect(() => {
    if (!badgeState.notifications || !notifications) {
      setNotiCount(0);
    } else {
      let count = 0;
      for (let notif of notifications) {
        if (notif.date < badgeState.notifications) break;
        count++;
      }
      setNotiCount(count);
    }
  }, [badgeState, notifications]);

  const notiClicked = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile) history.push("/notifications", { canGoBack: true });
      else setNotiAnchor(event.currentTarget);
    },
    [history, isMobile]
  );

  const reqClicked = useCallback(() => {
    history.push("/requests", { canGoBack: true });
  }, [history]);

  const closeNoti = useCallback(() => {
    setNotiAnchor(null);
  }, [setNotiAnchor]);

  return (
    <>
      <IconButton
        className={classes.button}
        onClick={reqClicked}
        aria-describedby="req"
        data-testid="friend-requests-button"
      >
        <Badge badgeContent={requestCount} className={classes.badge}>
          <Icon>people</Icon>
        </Badge>
      </IconButton>
      <IconButton
        className={classes.button}
        onClick={notiClicked}
        aria-describedby="noti"
        data-testid="notifications-button"
      >
        <Badge badgeContent={notiCount} className={classes.badge}>
          <Icon>notifications</Icon>
        </Badge>
      </IconButton>
      <Popover
        id="noti"
        open={Boolean(notiAnchor)}
        anchorEl={notiAnchor}
        onClose={closeNoti}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className={classes.menu}>
          <NotificationsScreen />
        </div>
      </Popover>
    </>
  );
};
