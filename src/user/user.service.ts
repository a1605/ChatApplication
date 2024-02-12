import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user-create.dto';
import { HASH_VALUE } from 'constant';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async registerOrLoginUser(createUserDto: CreateUserDto) {
    try {
      var user = await this.userRepo.findOne({
        where: { username: createUserDto.username },
      });
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        HASH_VALUE,
      );
      if (user) {
        const passwordMatch = await bcrypt.compare(
          createUserDto.password,
          user.password,
        );
        if (!passwordMatch) {
          throw new Error('Password does not matched ');
        }
        user.socketId = createUserDto.socketId;
        await this.userRepo.save(user);
      } else {
        user = await this.userRepo.create({
          username: createUserDto.username,
          socketId: createUserDto.socketId,
          password: hashedPassword,
        });
        await this.userRepo.save(user);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllUsers() {
    try {
      return await this.userRepo.find();
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to retrieve all users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSocketIdByUsername(username: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { username: username },
      });
      const id = user.socketId;
      return id;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to retrieve SocketId',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findUsernameUsingSocketId(socketId: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { socketId: socketId },
      });
      return user.username;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to retrieve Username',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findUserIdByUserName(username: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { username: username },
      });
      return user.id;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to retrieve Username',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
