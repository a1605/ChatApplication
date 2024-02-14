import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonColumns } from 'utills';

@Entity()
export class Message extends CommonColumns {
  @Column()
  @ManyToOne(() => User, { eager: true })
  sender_user_id: number;
  @Column()
  @ManyToOne(() => User, { eager: true })
  receiver_user_id: number;
  @Column()
  message: string;
}
