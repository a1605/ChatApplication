import { IsNotEmpty } from 'class-validator';

export class MessageDto {
  constructor(sender_user_id, receiver_user_id, message) {
    (this.sender_user_id = sender_user_id),
      (this.receiver_user_id = receiver_user_id),
      (this.message = message);
  }
  @IsNotEmpty()
  sender_user_id: number;
  @IsNotEmpty()
  receiver_user_id: number;
  @IsNotEmpty()
  message: string;
}
