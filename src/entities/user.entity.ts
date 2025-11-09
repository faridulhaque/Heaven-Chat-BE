import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('')
  name: string;

  @Column('')
  email: string;

  @Column('')
  avatar: string;
}
