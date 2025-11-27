import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('')
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('')
  avatar: string;

  @Column('jsonb', { nullable: true })
  blocked: string[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'timestamptz',
  })
  createdAt: Date;
}
