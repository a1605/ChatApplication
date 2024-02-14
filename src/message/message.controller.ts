import { MessageService } from 'src/message/message.service';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MAX_NUM, MIN_NUM } from 'constant';
import { ResponseInterceptor } from 'src/middleware/middleware.interceptor';

@Controller('msg')
@UseInterceptors(ResponseInterceptor)
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get('chats')
  async allChatBetweenTwoUsers(
    @Query('sender_user_id') sender_user_id: number,
    @Query('receiver_user_id') receiver_user_id: number,
  ) {
    return await this.messageService.allChatsHistoryBetweenTwoUsers(
      sender_user_id,
      receiver_user_id,
    );
  }
}
