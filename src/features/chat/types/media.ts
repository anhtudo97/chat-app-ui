export type Media = {
  url: string;
  thumbUrl?: string | undefined;
  type: MediaType;
};

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
