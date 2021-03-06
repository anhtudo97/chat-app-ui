import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { PulseLoader } from "react-spinners";
import { NotificationListItem } from "./components/notification-list-item";
import { Notification, NotificationType } from "../types/notification";
import { useNotificationActions } from "../notification-actions-context";
import { makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TopBar, useTopBarStyles } from "../../user/ui/components/top-bar";
import { stringifyNotificationError } from "../types/notification-error";
import { useBadgeActions } from "../../badge/badge-actions-context";
import { BadgeName } from "../../badge/types/badge";
import { BackButton } from "../../../shared/components/back-button";

const useStyles = makeStyles({
  outer: {
    width: "100%",
    height: "calc(100% - 70px)",
    display: "flex",
    flexDirection: "column",
    marginTop: "56px",
    overflowY: "auto",
  },
  centered: {
    margin: "auto",
  },
});

export const NotificationsScreen = () => {
  const state = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();
  const actions = useNotificationActions();
  const { updateBadge } = useBadgeActions();
  const history = useHistory();
  const classes = useStyles();
  const topBarClasses = useTopBarStyles();

  useEffect(() => {
    dispatch(updateBadge(BadgeName.NOTIFICATIONS));
  }, []);

  const onClick = useCallback((notification: Notification) => {
    dispatch(actions.markNotificationAsSeen(notification.id));
    if (notification.content.type === NotificationType.REQUEST_ACCEPTED) {
      history.push(`/u/${notification.content.user.username}`, {
        canGoBack: true,
      });
    }
  }, []);

  let child: React.ReactNode;
  if (state.error === null && state.notifications === null) {
    child = (
      <div className={classes.centered} data-testid="notification-loading">
        <PulseLoader />
      </div>
    );
  } else if (state.notifications) {
    if (state.notifications.length) {
      child = (
        <>
          {state.notifications.map((noti) => {
            return (
              <NotificationListItem
                notification={noti}
                onClick={onClick}
                key={noti.id}
              />
            );
          })}
        </>
      );
    } else {
      child = (
        <span className={classes.centered} data-testid="empty-notification">
          No notifications
        </span>
      );
    }
  } else {
    child = (
      <span className={classes.centered} data-testid="notification-error">
        {stringifyNotificationError(state.error!)}
      </span>
    );
  }
  return (
    <div className={classes.outer}>
      <TopBar>
        <BackButton mobileOnly />
        <Typography variant="h6" className={topBarClasses.title}>
          Notifications
        </Typography>
      </TopBar>
    </div>
  );
};
