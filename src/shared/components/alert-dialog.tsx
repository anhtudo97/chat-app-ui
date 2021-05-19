import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

type AlertDialogProps = {
  title: string;
  content: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  content,
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="alert-dialog"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" data-testid="alert-confirm">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          autoFocus
          data-testid="alert-confirm"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
