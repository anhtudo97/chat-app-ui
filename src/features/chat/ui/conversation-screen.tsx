import React, { useCallback, useEffect, useState } from "react";
import { ButtonBase, makeStyles, Typography } from "@material-ui/core";
import { TopBar } from "../../user/ui/components/top-bar";
import { useHistory, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import useChatActions from "../chat-actions-provider";
import { ChatTextField } from "./components/chat-text-field";
import { MessagesList } from "./components/messages-list";
import { useDropzone } from "react-dropzone";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { ErrorSnackbar } from "../../../shared/components/snackbars";
import { FriendAvatar } from "../../friend/ui/components/friend-avatar";
import { shallowEqual } from "react-redux";
import { BackButton } from "../../../shared/components/back-button";
import { useMobileMQ } from "../../../shared/styles/media-query";

export const ConversationScreen = () => {
  const dispatch = useAppDispatch();
  const chatActions = useChatActions();

  const [isActive, setIsActive] = useState(document.hasFocus());
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<CustomError | null>(null);
  const conversationID = Number(useParams<{ id: string }>().id);

  const conversation = useAppSelector((state) =>
    state.chat.conversations?.find((c) => c.id === conversationID)
  );
  const friend = useAppSelector((state) =>
    state.friends.friends?.find(
      (f) => f.user.id === conversation?.participants[0].id,
      shallowEqual
    )
  );

  const history = useHistory();
  const otherUser = conversation?.participants[0];
  const isMobile = useMobileMQ();

  useEffect(() => {
    window.onblur = () => setIsActive(false);
    window.onfocus = () => setIsActive(true);
    return () => {
      window.onblur = null;
      window.onfocus = null;
    };
  }, []);

  useEffect(() => {
    if (isActive) dispatch(chatActions.messagesSeen(Number(conversationID)));
  }, [isActive, conversation]);

  // Callback for when a picked file is removed
  const fileRemoved = useCallback((index: number) => {
    setFiles((files) => files.filter((_, i) => i !== index));
  }, []);

  // Callback for when a file is picked
  const onDrop = useCallback((newFiles: File[]) => {
    if (newFiles.length) {
      setFiles((files) => {
        const allFiles = [...files, ...newFiles];
        if (allFiles.length > 10) {
          setFileError((error) => ({
            message: `You can't send more than 10 files`,
            pleaseRerender: (error?.pleaseRerender ?? 0) + 1,
          }));
          return files;
        }
        const totalSize = allFiles.reduce(
          (size: number, file) => size + file.size,
          0
        );
        if (totalSize > 25000000) {
          setFileError((error) => ({
            message: `You can't send more than 25mb`,
            pleaseRerender: (error?.pleaseRerender ?? 0) + 1,
          }));
          return files;
        }
        return allFiles;
      });
    }
  }, []);

  // Callback for when the user sends the message
  const submit = useCallback(
    (text: string) => {
      const msgText = text.trim();
      if (!msgText && !files.length) return;

      dispatch(
        chatActions.sendMessage({
          conversationID: Number(conversationID),
          tempID: new Date().getTime(),
          text: msgText ?? undefined,
          medias: files.length ? files : null,
        })
      );
    },
    [conversationID, files]
  );

  // Identity function for error snackbar
  const stringifyCustomError = useCallback(
    (error: CustomError | null) => error?.message ?? "",
    []
  );

  // Callback for when the avatar/name on the top bar is clicked
  const goToProfile = useCallback(() => {
    if (otherUser)
      history.push(`/u/${otherUser.username}`, { canGoBack: true });
  }, [history, otherUser]);

  // React dropzone stuff
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: "image/*,video/*",
    noClick: true,
    noKeyboard: true,
  });

  const classes = useStyles({ isDragActive, isMobile });

  // Add more props to
  const rootProps = getRootProps({
    className: classes.outer,
    "data-testid": "conversation-screen",
  });
  const inputProps = getInputProps();

  return (
    <div {...rootProps}>
      <TopBar>
        <BackButton mobileOnly />
        <ButtonBase onClick={goToProfile} className={classes.avatarName}>
          <FriendAvatar
            src={otherUser?.photo?.small}
            lastSeen={friend?.lastSeen}
          />
          <Typography variant="h6" className={classes.title}>
            {otherUser?.name ?? otherUser?.username}
          </Typography>
        </ButtonBase>
      </TopBar>
      <MessagesList
        conversationID={conversationID}
        key={`messagesList-${conversationID}`}
      />
      <ChatTextField
        conversationID={conversationID}
        files={files}
        fileRemoved={fileRemoved}
        submit={submit}
        addFileClicked={open}
        filesPasted={onDrop}
        key={`chatTextField-${conversationID}`}
      />
      <div className={classes.dragIndicator}>Drop files here</div>
      <input {...inputProps} />
      <ErrorSnackbar<CustomError>
        currentError={fileError}
        stringify={stringifyCustomError}
      />
    </div>
  );
};

type CustomError = { message: string; pleaseRerender: number };

const useStyles = makeStyles<
  Theme,
  { isDragActive: boolean; isMobile: boolean }
>({
  outer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingTop: "64px",
    background: "white",
  },
  avatarName: (props) => ({
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    color: "black",
    fontSize: "1.2rem",
    width: props.isMobile ? "80%" : "100%",
  }),
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    textAlign: "start",
    whiteSpace: "nowrap",
    paddingLeft: "0.5rem",
  },
  dragIndicator: (props) => {
    let opacity: number;
    let display: string;
    if (props.isDragActive) {
      opacity = 0.8;
      display = "flex";
    } else {
      opacity = 0;
      display = "none";
    }
    return {
      display,
      opacity,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      width: "100%",
      height: "100%",
      color: "black",
      background: "white",
    };
  },
});
