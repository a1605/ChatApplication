import { MessageService } from 'src/message/message.service';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MAX_NUM, MIN_NUM } from 'constant';
import { ResponseInterceptor } from 'src/middleware/middleware.interceptor';

@Controller('msg')
@UseInterceptors(ResponseInterceptor)
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get('allchats')
  async getAllChats(
    @Query('page') page: number = MIN_NUM,
    @Query('limit') limit: number = MAX_NUM,
  ) {
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
