import User from "../../types/user";
import { Avatar, makeStyles, Typography } from "@material-ui/core";
import React from "react";

type CommonProfileInfoProps = {
  user: User;
};

const useStyles = makeStyles({
  layout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    border: "1px solid black",
  },
  username: {
    fontSize: "1rem",
    textAlign: "center",
  },
  name: {
    fontSize: "0.8rem",
    textAlign: "center",
  },
});

export const CommonProfileInfo: React.FC<CommonProfileInfoProps> = ({
  user,
}) => {
  const classes = useStyles();
  const { photo, username, name } = user;
  return (
    <div className={classes.layout} data-testid="common-profile-info">
      <Avatar className={classes.photo} src={photo?.medium} />
      <Typography className={classes.username}>@{username}</Typography>
      {name && <Typography className={classes.name}>{name}</Typography>}
    </div>
  );
};
