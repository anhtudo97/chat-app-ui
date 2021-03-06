import React, { useCallback, useState } from "react";
import {
  Button,
  createStyles,
  makeStyles,
  Switch,
  Typography,
} from "@material-ui/core";
import { TopBar, useTopBarStyles } from "../../user/ui/components/top-bar";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { useAuthActions } from "../../auth/auth-actions-context";
import { useMeActions } from "../../user/me-actions-context";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { useHistory } from "react-router-dom";
import { AlertDialog } from "../../../shared/components/alert-dialog";
import { useFriendsActions } from "../../friend/friends-actions-context";
import { BackButton } from "../../../shared/components/back-button";

const useStyles = makeStyles({
  outer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingTop: "56px",
  },
  switch: {
    "& .Mui-checked": {
      color: "green",
    },
    "&& .MuiSwitch-track": {
      backgroundColor: "green",
    },
  },
});

type ButtonStyles = {
  color?: string | undefined;
};

const useButtonStyles = makeStyles<Theme, ButtonStyles>((theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
      height: "55px",
      "& .MuiButton-label": {
        color: (props) => props.color,
        justifyContent: "start",
      },
    },
  })
);

export const SettingsScreen = () => {
  const meState = useAppSelector((state) => state.me);
  const { signOut } = useAuthActions();
  const { toggleActiveStatus } = useMeActions();
  const { getFriends } = useFriendsActions();
  const dispatch = useAppDispatch();

  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const topBarClasses = useTopBarStyles();

  const toggleAS = useCallback(async () => {
    const result = await dispatch(toggleActiveStatus());
    if (result.meta.requestStatus === "fulfilled") dispatch(getFriends());
  }, []);

  const goToBlockedUsersScreen = useCallback(() => {
    history.push("/blocked-users", { canGoBack: true });
  }, []);

  const logoutClicked = useCallback(() => {
    setLogoutMenuOpen(true);
  }, []);

  const logoutConfirmed = useCallback(async () => {
    setLogoutMenuOpen(false);
    dispatch(signOut());
  }, []);

  const logoutCanceled = useCallback(() => {
    setLogoutMenuOpen(false);
  }, []);

  return (
    <div className={classes.outer} data-testid="settings-screen">
      <TopBar>
        <BackButton />
        <Typography variant="h6" className={topBarClasses.title}>
          Settings
        </Typography>
      </TopBar>
      <SettingsItem onClick={toggleAS} disabled={meState.updatingUser}>
        Active status
        <Switch
          className={classes.switch}
          disabled={meState.updatingUser}
          checked={meState.me!.activeStatus}
        />
      </SettingsItem>
      <SettingsItem onClick={goToBlockedUsersScreen}>
        Blocked users
      </SettingsItem>
      <SettingsItem color="red" onClick={logoutClicked}>
        Log out
      </SettingsItem>
      <AlertDialog
        title="Log out"
        content="Are you sure you want to logout?"
        open={logoutMenuOpen}
        onCancel={logoutCanceled}
        onConfirm={logoutConfirmed}
      />
    </div>
  );
};

type SettingsItemProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: string | undefined;
};

const SettingsItem: React.FC<SettingsItemProps> = ({
  children,
  onClick,
  disabled,
  color,
}) => {
  const classes = useButtonStyles({ color });
  return (
    <Button
      className={classes.button}
      onClick={onClick}
      disabled={disabled ?? false}
    >
      {children}
    </Button>
  );
};
