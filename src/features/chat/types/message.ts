import { Media } from "./media";

type Message = {
  id: number;
  conversationID: number;
  senderID: string;
  text?: string | null;
  medias?: Media[] | null;
  sentAt: number;
  deliveredTo: Delivery[];
  seenBy: Delivery[];
  sent: boolean;
  error?: boolean;
};

export type Delivery = {
  userID: string;
  date: number;
};

export type MessageSub = {
  message: Message;
  update?: boolean | null;
};

export default Message;
