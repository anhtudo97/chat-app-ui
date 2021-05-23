import { Avatar, Icon, makeStyles } from "@material-ui/core";
import React from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

export enum DeliveryStatusType {
  SENDING = "SENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  SEEN = "SEEN",
  NONE = "NONE",
}

export type DeliveryStatusProps = {
  type: DeliveryStatusType;
  date: number;
  photoURL?: string;
};

const useStyles = makeStyles<Theme, { type: DeliveryStatusType }>(() => {
  const shared: React.CSSProperties = {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
  };
  return {
    sending: {
      ...shared,
      border: "1px solid grey",
    },
    seen: {
      ...shared,
    },
    status: (p) => {
      let background;
      if (p.type == DeliveryStatusType.DELIVERED) {
        background = "grey";
      } else {
        background = "white";
      }
      return {
        ...shared,
        background,
        border: "1px solid grey",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };
    },
    statusIcon: (props) => ({
      "&&": {
        fontSize: "10px",
        color: props.type == DeliveryStatusType.DELIVERED ? "white" : "grey",
      },
    }),
  };
});

export const DeliveryStatus: React.FC<DeliveryStatusProps> = ({
  type,
  date,
  photoURL,
}) => {
  const classes = useStyles({ type });

  switch (type) {
    case DeliveryStatusType.SENDING:
      return <div className={classes.sending} />;
    case DeliveryStatusType.SENT:
    case DeliveryStatusType.DELIVERED:
      return (
        <div className={classes.status}>
          <Icon className={classes.statusIcon}>check</Icon>
        </div>
      );
    case DeliveryStatusType.SEEN:
      return <Avatar className={classes.seen} src={photoURL} />;
    default:
      return <div />;
  }
};
