import React, { useCallback, useEffect, useState } from "react";
import MuiAlert, { Color } from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

type AlertSnackbarProps = {
  open: boolean;
  autoHideDuration: number;
  onClose: (event?: React.SyntheticEvent, reason?: string) => void;
  severity: Color;
  message: string;
};

export const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  open,
  autoHideDuration,
  severity,
  message,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

type ErrorSnackbarProps<ErrorType> = {
  currentError: ErrorType | null;
  stringify: (e: ErrorType | null) => string;
  exclude?: ErrorType[];
};

export function ErrorSnackbar<ErrorType>(props: ErrorSnackbarProps<ErrorType>) {
  const [error, setError] = useState<ErrorType | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { currentError, stringify, exclude } = props;

  // Show the snackbar if there was an error (must not be excluded)
  useEffect(() => {
    if (
      currentError != null &&
      (!exclude || exclude.indexOf(currentError)) === -1
    ) {
      setError(currentError);
      setSnackbarVisible(true);
    }
  }, [currentError]);

  const closeSnackbar = useCallback(
    (event?: React.SyntheticEvent, reason?: string) => {
      // Don't dismiss the alert if the user clicks out of it
      if (reason === "clickaway") return;
      setSnackbarVisible(false);
    },
    [setSnackbarVisible]
  );

  return (
    <AlertSnackbar
      open={snackbarVisible}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      severity="error"
      message={stringify(error)}
    />
  );
}

type SuccessSnackbarProps = {
  renderCount: number;
  message: string;
};

export const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  renderCount,
  message,
}) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Show the snackbar if there was an error (must not be an abortedByUser error)
  useEffect(() => {
    if (renderCount) setSnackbarVisible(true);
  }, [renderCount]);

  const closeSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    // Don't dismiss the alert if the user clicks out of it
    if (reason === "clickaway") return;
    setSnackbarVisible(false);
  };
  return (
    <AlertSnackbar
      open={snackbarVisible}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      severity="success"
      message={message ?? ""}
    />
  );
};
