import React, { useCallback } from "react";
import Conversation from "../../types/conversation";
import {
  createStyles,
  Icon,
  ListItem,
  ListItemAvatar,
  makeStyles,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { MediaType } from "../../types/media";
import { formatDate } from "../../../../shared/utils/date-utils";
import { DeliveryStatus, DeliveryStatusType } from "./delivery-status";
import { FriendAvatar } from "../../../friend/ui/components/friend-avatar";
import { useAppSelector } from "../../../../core/redux/hooks";
import { shallowEqual } from "react-redux";

export type ConversationListItemProps = {
  conversation: Conversation;
  currentUserID: string;
  typing: boolean;
  onClick: (conversation: Conversation) => void;
  style?: React.CSSProperties;
};

export const CoversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  currentUserID,
  typing,
  onClick,
  style,
}) => {
  const friend = useAppSelector((state) => {
    return state.friends.friends?.find((f) => {
      return f.user.id === conversation.participants[0].id;
    });
  }, shallowEqual);

  const message =
    conversation.messages.length > 0
      ? conversation.messages[conversation.messages.length - 1]
      : undefined;

  const mine = message?.senderID === currentUserID;
  const seen = Boolean(mine || message?.seenBy[0]);
  const classes = useStyles({ seen });

  const onClicked = useCallback(() => {
    onClick(conversation);
  }, [conversation, onClick]);

  if (!message) return <div />;

  const user = conversation.participants[0];
  let status: DeliveryStatusType;
  if (!message.sent) status = DeliveryStatusType.SENDING;
  else if (!mine) status = DeliveryStatusType.SEEN;
  else {
    if (message.seenBy[0]) status = DeliveryStatusType.SEEN;
    else if (message.deliveredTo[0]) status = DeliveryStatusType.DELIVERED;
    else status = DeliveryStatusType.SEEN;
  }

  let secondary: React.ReactNode;
  const date = ` - ${formatDate(message.sentAt, "mini-minute-now")}`;
  if (typing) secondary = <span className={classes.typing}>Typing ... </span>;
  else if (message.text) {
    secondary = (
      <>
        <span className={classes.secondaryText}>
          {mine && "You: "}
          {message.text}
        </span>
        <span>{date}</span>
      </>
    );
  } else if (message.medias?.length) {
    let icon, text: string;
    if (message.medias[0].type === MediaType.VIDEO) {
      (icon = "videocam"), (text = "Video");
    } else {
      icon = "photo_camera";
      text = "Photo";
    }
    secondary = (
      <>
        {mine && <span className={classes.span}>{"You: "}</span>}
        <Icon className={classes.secondaryIcon}>{icon}</Icon>
        {text}
        {date}
      </>
    );
  } else {
    secondary = "";
  }
  return (
    <div style={style!} data-testid="conversation-list-iem">
      <ListItem button onClick={onClicked}>
        <ListItemAvatar>
          <FriendAvatar src={user.photo?.small} lastSeen={friend?.lastSeen!} />
        </ListItemAvatar>
        <div className={classes.listItemText}>
          <span className={classes.primary}>{user.name ?? user.username}</span>
          <span className={classes.secondary}>{secondary}</span>
        </div>
        <div className={classes.deliveryStatus}>
          {!seen && <div className={classes.dot} />}
          {seen && (
            <DeliveryStatus
              type={status}
              date={message.sentAt}
              photoURL={user.photo?.small!}
            />
          )}
        </div>
      </ListItem>
    </div>
  );
};

type StyleProps = {
  seen: boolean;
};
const useStyles = makeStyles<Theme, StyleProps>((props) => {
  const blue = "#2F88FB";
  return createStyles({
    dot: {
      maxHeight: "12px",
      maxWidth: "12px",
      minHeight: "12px",
      minWidth: "12px",
      borderRadius: "50%",
      background: blue,
    },
    listItemText: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      flex: 1,
      paddingRight: "8px",
      height: "55px",
    },
    primary: (props: StyleProps) => ({
      fontWeight: props.seen ? "normal" : "bold",
      color: "black",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      maxWidth: "100%%",
      paddingBottom: "8px",
    }),
    secondary: (props) => ({
      display: "flex",
      alignItems: "center",
      width: "100%",
      textOverflow: "ellipsis",
      color: props.seen ? "grey" : "black",
      fontSize: "0.875rem",
    }),
    secondaryText: (props) => ({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "80%",
      fontWeight: props.seen ? "normal" : "bold",
      paddingRight: "5px",
      boxSizing: "border-box",
    }),
    deliveryStatus: {
      margin: "8px",
    },
    secondaryIcon: {
      "&&": {
        fontSize: "1rem",
        marginRight: "4px",
      },
    },
    typing: {
      color: "grey",
    },
    span: {
      whiteSpace: "pre",
    },
  });
});
