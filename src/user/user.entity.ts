import { Column, Entity } from 'typeorm';
import { CommonColumns } from 'utills';

@Entity()
export class User extends CommonColumns {
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  socketId: string;
}
