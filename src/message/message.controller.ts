import { MessageService } from 'src/message/message.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('msg')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get('allchats')
  async getAllChats() {
    return await this.messageService.getAllChats();
  }
  @Get('users/:senderName/:receiverName')
  async allChatBetweenTwoUsers(
    @Param('senderName') senderName: string,
    @Param('receiverName') receiverName: string,
  ) {
    return await this.messageService.allChatsHistoryWithTwoUsers(
      senderName,
      receiverName,
    );
  }
}
