import { RetryButton } from "./retry-button";
import React from "react";
import { makeStyles } from "@material-ui/styles";

export type RetryPageProps = {
  onRetry: () => void;
  errorMessage: string;
};

export const RetryPage: React.FC<RetryPageProps> = ({
  onRetry,
  errorMessage,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <RetryButton onClick={onRetry} message={errorMessage} />
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
});
