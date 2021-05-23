import { Media, MediaType } from "../../../types/media";
import React, { useCallback } from "react";
import { ButtonBase, Icon, makeStyles } from "@material-ui/core";

type MessageMediaCellProps = {
  media: Media;
  index: number;
  onClick: (index: number) => void;
  className?: string;
};

const useStyles = makeStyles({
  media: {
    objectFit: "cover",
    borderRadius: "16px",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    outline: "none",
  },
  play: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: "16px",
  },
  playIcon: {
    "&&": {
      background: "rgba(0,0,0,0.3)",
      borderRadius: "50%",
      color: "white",
      fontSize: "3rem",
    },
  },
});

export const MessageMediaCell: React.FC<MessageMediaCellProps> = ({
  media,
  index,
  onClick,
  className,
}) => {
  const classes = useStyles({ count: 1 });

  const onClickMedia = useCallback(() => {
    onClick(index);
  }, [onClick, index]);

  return (
    <ButtonBase className={className} onClick={onClickMedia}>
      {media.type === MediaType.IMAGE ? (
        <img className={classes.media} src={media.thumbUrl} alt="media" />
      ) : (
        <video className={classes.media} src={media.thumbUrl} />
      )}
      {media.type === MediaType.VIDEO && (
        <div className={classes.play}>
          <Icon className={classes.playIcon}>play_circle</Icon>
        </div>
      )}
    </ButtonBase>
  );
};
