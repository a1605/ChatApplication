import { UserController } from '../user/user.controller';
import { Module } from '@nestjs/common';
import { ChatGateway } from './server.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [ChatGateway, UserService, MessageService],
  controllers: [UserController],
})
export class ServerModule {}
