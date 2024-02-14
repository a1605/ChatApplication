import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseInterceptor } from 'src/middleware/middleware.interceptor';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('all-users')
  async findAllUser() {
    return await this.userService.getAllUsers();
  }
  @Get(':username')
  async findUserIdByUserName(@Param('username') username: string) {
    return await this.userService.findUserIdByUserName(username);
  }
}
