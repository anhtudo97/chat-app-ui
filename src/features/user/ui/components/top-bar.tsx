import React from "react";
import { AppBar, createStyles, makeStyles, Toolbar } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { nonSelectable } from "../../../../shared/styles/shared";

type TopBarProps = {
  children: React.ReactNode;
};

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "white",
  },
  toolBar: {
    backgroundColor: "white",
    ...nonSelectable,
  },
});

export const TopBar: React.FC<TopBarProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="absolute" elevation={0}>
      <Toolbar className={classes.toolBar}>{children}</Toolbar>
    </AppBar>
  );
};

export const useTopBarStyles = makeStyles((theme: Theme) =>
  createStyles({
    leading: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      color: "black",
    },
    actionButton: {
      color: "black",
      "& .material-icons": {
        fontSize: "1.8rem",
      },
    },
  })
);
