import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  conversationId: string;

  @Column('jsonb', { nullable: false })
  members: string[];

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
