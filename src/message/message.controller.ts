import { MessageService } from 'src/message/message.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('msg')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get('allchats')
  async getAllChats() {
    return await this.messageService.getAllChats();
  }
  @Get('chats')
  async allChatBetweenTwoUsers(
    @Query('sender_user_id') sender_user_id: number,
    @Query('receiver_user_id') receiver_user_id: number,
  ) {
    return await this.messageService.allChatsHistoryWithTwoUsers(
      sender_user_id,
      receiver_user_id,
    );
  }
}
