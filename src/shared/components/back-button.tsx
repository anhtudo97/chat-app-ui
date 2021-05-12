import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Icon, IconButton, makeStyles } from "@material-ui/core";
import { useMobileMQ } from "../styles/media-query";

type BackButtonProps = {
  to?: string;
  hide?: boolean;
  mobileOnly?: boolean;
  className?: string;
};

const useStyles = makeStyles({
  icon: {
    color: "black",
  },
});

const BackButton: React.FC<BackButtonProps> = ({
  to,
  hide,
  mobileOnly,
  className,
}) => {
  const history = useHistory();
  const state = history.location.state as any;
  const isMobile = useMobileMQ();
  const classes = useStyles();

  const onClick = useCallback(() => {
    if (to) return history.replace(to, { canGoBack: true });
    if (state && state.canGoBack) history.goBack();
    else history.replace("/");
  }, [history, to]);

  if (hide || (mobileOnly && !isMobile)) {
    return <div />;
  }
  return (
    <IconButton className={className} onClick={onClick}>
      <Icon className={classes.icon}>arrow_back</Icon>
    </IconButton>
  );
};

export default BackButton;
