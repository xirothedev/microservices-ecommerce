import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // REST API endpoints
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  // Microservice message patterns
  @MessagePattern('get_user')
  getUser(@Payload() payload: { id: string }) {
    return this.usersService.findOne(payload.id);
  }

  @MessagePattern('get_user_by_email')
  getUserByEmail(@Payload() payload: { email: string }) {
    return this.usersService.findByEmail(payload.email);
  }

  @MessagePattern('get_user_by_username')
  getUserByUsername(@Payload() payload: { username: string }) {
    return this.usersService.findByUsername(payload.username);
  }

  @MessagePattern('create_user')
  createUser(@Payload() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @MessagePattern('update_user')
  updateUser(@Payload() payload: { id: string; data: UpdateUserDto }) {
    return this.usersService.update(payload.id, payload.data);
  }

  @MessagePattern('delete_user')
  deleteUser(@Payload() payload: { id: string }) {
    return this.usersService.remove(payload.id);
  }

  @MessagePattern('validate_user_password')
  validateUserPassword(
    @Payload() payload: { plainPassword: string; hashedPassword: string },
  ) {
    return this.usersService.validatePassword(
      payload.plainPassword,
      payload.hashedPassword,
    );
  }
}
