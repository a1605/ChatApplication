import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HASH_VALUE, MAX_NUM, MIN_NUM } from 'constant';
import { skipCount } from 'utills';
import { MessageDto } from './messageDto/message.dto';
import { UserService } from './../user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    private userService: UserService,
  ) {}

  async addChatHistory(messageDto: MessageDto) {
    try {
      const newMsgHistory = {
        sender_user_id: messageDto.sender_user_id,
        receiver_user_id: messageDto.receiver_user_id,
        message: messageDto.message,
      };
      await this.messageRepo.save(newMsgHistory);
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to add chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllChats(page: number = MIN_NUM, limit: number = MAX_NUM) {
    try {
      const offset = skipCount(page, limit);
      const [chats, totalCount] = await this.messageRepo.findAndCount({
        skip: offset,
        take: limit,
      });

      return {
        results: chats,
        page,
        limit,
        totalCount,
      };
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to retrieve chats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async allChatsHistoryWithTwoUsers(sender_user_id, receiver_user_id) {
    try {
      const history = await this.messageRepo.find({
        where: [
          {
            sender_user_id: sender_user_id,
            receiver_user_id: receiver_user_id,
          },

          {
            sender_user_id: receiver_user_id,
            receiver_user_id: sender_user_id,
          },
        ],
        order: {
          createdAt: 'ASC',
        },
      });
      if (!history) return [];
      return history;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to retrieve chat history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
