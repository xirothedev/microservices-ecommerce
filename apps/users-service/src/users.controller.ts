import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import type {
  CreateUserRequest,
  GetUserRequest,
  User,
  UserList,
} from './interfaces/user.interface';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('user.create')
  createUser(@Payload() data: CreateUserRequest): User {
    console.log('Users Service - Received CreateUser:', data);
    return this.usersService.create(data);
  }

  @MessagePattern('user.get')
  getUser(@Payload() data: GetUserRequest): User {
    console.log('Users Service - Received GetUser:', data);
    return this.usersService.findOne(data.id);
  }

  @MessagePattern('user.getAll')
  getAllUsers(@Payload() _data: any): UserList {
    console.log('Users Service - Received GetAllUsers:', _data);
    return { users: this.usersService.findAll() };
  }
}
