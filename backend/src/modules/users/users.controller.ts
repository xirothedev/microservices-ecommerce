import { Controller, Put, Req, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { ImageInterceptor } from '@/common/interceptors/image.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('avatar')
  @UseInterceptors(ImageInterceptor('avatar'))
  @ApiOperation({ summary: 'Change user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  changeUserAvatar(@Req() req: Request, avatar: Express.Multer.File) {
    return this.usersService.updateUserAvatar(req, avatar);
  }
}
