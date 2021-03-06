import { Media, MediaType } from "../../../types/media";
import { Icon, IconButton, makeStyles } from "@material-ui/core";
import { FullScreenDialog } from "../../../../user/ui/components/fullscreen-dialog";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { nonSelectable } from "../../../../../shared/styles/shared";

export type FullscreenMessageMediaProps = {
  visible: boolean;
  medias: Media[];
  initialIndex: number;
  onClose: () => void;
};

SwiperCore.use([Navigation, Pagination]);

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    ...nonSelectable,
  },
  media: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    background: "black",
    outline: "none",
  },
  closeButton: {
    position: "absolute",
    zIndex: 1000,
    color: "white",
    background: "rgba(0, 0, 0, 0.1)",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.3)",
    },
  },
});

export const FullscreenMessageMedia: React.FC<FullscreenMessageMediaProps> = ({
  visible,
  medias,
  initialIndex,
  onClose,
}) => {
  const classes = useStyles();

  const slides = medias.map((media) => {
    const slide =
      media.type === MediaType.IMAGE ? (
        <img className={classes.media} src={media.url} alt="media" />
      ) : (
        <video className={classes.media} src={media.url} controls />
      );
    return <SwiperSlide key={`${media.url}`}>{slide}</SwiperSlide>;
  });

  return (
    <FullScreenDialog visible={visible}>
      <IconButton className={classes.closeButton} onClick={onClose}>
        <Icon>clear</Icon>
      </IconButton>
      <Swiper
        className={classes.root}
        initialSlide={initialIndex}
        navigation
        pagination
      >
        {slides}
      </Swiper>
    </FullScreenDialog>
  );
};
