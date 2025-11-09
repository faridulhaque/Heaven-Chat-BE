export type TMessageDataFE = {
  message: string;
  type: string;
  to: string;
  conversationId: string;
};

export type TMessageData = {
  senderId: string;
  recipientId: string;
  message: any;
  type: string;
};
