import { Controller, Put, Req, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { ImageInterceptor } from '@/common/interceptors/image.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('avatar')
  @UseInterceptors(ImageInterceptor('avatar'))
  changeUserAvatar(@Req() req: Request, avatar: Express.Multer.File) {
    return this.usersService.updateUserAvatar(req, avatar);
  }
}
