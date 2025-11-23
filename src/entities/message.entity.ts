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
  from: string;

  @Column('uuid')
  to: string;

  @Column('jsonb', { nullable: false })
  message: string;

  @Column('')
  type: string;

  @ManyToOne(() => ConversationEntity, (c) => c.messages)
  conversation: ConversationEntity;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
