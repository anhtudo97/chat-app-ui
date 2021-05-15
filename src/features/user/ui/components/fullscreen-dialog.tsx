import React from "react";
import { Dialog, makeStyles, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} timeout={400} />;
});

type FullScreenDialogProps = {
  children: React.ReactNode;
  visible: boolean;
  onClose?: () => void;
};
const useStyles = makeStyles({
  root: {
    position: "relative",
  },
});

export const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
  children,
  visible,
  onClose,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      className={classes.root}
      fullScreen
      open={visible}
      onClose={onClose}
    >
      {children}
    </Dialog>
  );
};
