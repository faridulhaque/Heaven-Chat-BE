import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  messageId: string;

  @Column('uuid')
  senderId: string;

  @Column('uuid')
  recipientId: string;

  @Column('jsonb', { nullable: false })
  message: Record<string, any>;

  @Column('')
  type: string;

  @ManyToOne(() => ConversationEntity, (c) => c.messages)
  conversation: ConversationEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
