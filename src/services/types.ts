import { UserEntity } from 'src/entities/user.entity';

export type TMessageDataFE = {
  message: string;
  type: string;
  to: string;
  from: string;
  conversationId: string;
};

export type TMessageData = {
  senderId: string;
  recipientId: string;
  message: any;
  type: string;
};

export interface RequestWithUser extends Request {
  user: UserEntity;
}
