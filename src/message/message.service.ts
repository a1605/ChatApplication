import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HASH_VALUE, MAX_NUM, MIN_NUM } from 'constant';
import { skipCount } from 'utills';
import { User } from 'src/user/user.entity';
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
        'Chat History not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllChats(
    @Query('page') page: number = MIN_NUM,
    @Query('limit') limit: number = MAX_NUM,
  ) {
    try {
      const offset = skipCount(page, limit);
      const [users, totalCount] = await this.messageRepo.findAndCount({
        skip: offset,
        take: limit,
      });

      return {
        results: users,
        page,
        limit,
        totalCount,
      };
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Chat not found',
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
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
