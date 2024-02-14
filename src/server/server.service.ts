import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { MessageService } from 'src/message/message.service';
import { CreateUserDto } from './../user/dto/user-create.dto';
import { MessageDto } from 'src/message/messageDto/message.dto';
import { ResponseInterceptor } from 'src/middleware/middleware.interceptor';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly userService: UserService,
    private messageService: MessageService,
  ) {}

  async handleConnection(socket: Socket) {}

  afterInit(server: Server) {}

  @UseInterceptors(ResponseInterceptor)
  @SubscribeMessage('new-user-joined')
  async handleNewAndExistingUserJoined(client: any, data: any) {
    const createUserDto = new CreateUserDto(
      data.username,
      data.password,
      client.id,
    );
    const registrationStatus =
      await this.userService.registerOrLoginUser(createUserDto);
    client.emit('registration-response', { success: registrationStatus });
  }

  @SubscribeMessage('send')
  async handleMessage(client: Socket, messageBody) {
    const { receiverName, senderName, message } = messageBody;
    const socketId =
      await this.userService.findSocketIdByUsername(receiverName);
    const senderUserId =
      await this.userService.findUserIdByUserName(senderName);
    const receiverUserId =
      await this.userService.findUserIdByUserName(receiverName);
    const messageDto = new MessageDto(senderUserId, receiverUserId, message);
    await this.messageService.addChatHistory(messageDto);
    this.server.to(socketId).emit('receive', { senderName, message });
  }
}
