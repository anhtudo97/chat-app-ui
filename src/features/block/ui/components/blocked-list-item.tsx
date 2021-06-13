import React, { useCallback } from "react";
import { Block } from "../../types/block";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";

export type BlockedListItemProps = {
  block: Block;
  onClick: (block: Block) => void;
  style?: React.CSSProperties;
};

const useStyles = makeStyles({
  listItem: {
    minHeight: "72",
    maxHeight: "72",
    position: "relative",
  },
});

export const BlockedListItem: React.FC<BlockedListItemProps> = ({
  block,
  onClick,
  style,
}) => {
  const classes = useStyles();

  const onItemClicked = useCallback(() => {
    onClick(block);
  }, []);

  return (
    <div style={style} data-testid="blocked-list-item">
      <ListItem className={classes.listItem} onClick={onItemClicked} button>
        <ListItemAvatar>
          <Avatar src={block.user.photo?.small!} />
        </ListItemAvatar>
        <ListItemText primary={block.user.username} />
      </ListItem>
    </div>
  );
};
