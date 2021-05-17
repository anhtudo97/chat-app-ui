import { Button, Dialog, Icon, makeStyles } from "@material-ui/core";
import React from "react";

export type MenuDialogItemProps = {
  icon: string;
  label: string;
  onClick: () => void;
  className?: string;
};

type MenuDialogProps = {
  visible: boolean;
  items: MenuDialogItemProps[];
  onClose: () => void;
};

const useStyles = makeStyles({
  wrapper: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    minWidth: "200px",
  },
  item: {
    display: "flex",
    justifyContent: "left",
  },
});

const MenuDialogItem: React.FC<MenuDialogItemProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <Button
      className={className}
      startIcon={<Icon>{icon}</Icon>}
      onClick={onClick}
      data-testid={`menu-item-${icon}`}
    >
      {label}
    </Button>
  );
};

export const MenuDialog: React.FC<MenuDialogProps> = ({
  visible,
  items,
  onClose,
}) => {
  const classes = useStyles();
  const menuItems = items.map((item, idx) => (
    <MenuDialogItem key={item.label} className={classes.item} {...item} />
  ));
  return (
    <Dialog
      open={visible}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
    >
      <div className={classes.wrapper}>{menuItems}</div>
    </Dialog>
  );
};
