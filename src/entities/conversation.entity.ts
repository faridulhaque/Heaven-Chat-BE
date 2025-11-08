import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  conversationId: string;

  @Column('jsonb', { nullable: false })
  members: string[];

  @Column('jsonb', { nullable: false })
  message: Record<string, any>;
}
