import React from "react";
import { Icon, IconButton, makeStyles } from "@material-ui/core";

type RetryButtonProps = {
  onClick: () => void;
  message: string;
};

export const RetryButton: React.FC<RetryButtonProps> = ({
  onClick,
  message,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton onClick={onClick} data-testid="retry-button">
        <Icon className={classes.icon}>refresh</Icon>
      </IconButton>
      <p className={classes.message}>{message}</p>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  icon: {
    "&&": {
      color: "black",
      fontSize: "1.5em",
    },
  },
  message: {
    margin: "0 10px",
    textAlign: "center",
  },
});
