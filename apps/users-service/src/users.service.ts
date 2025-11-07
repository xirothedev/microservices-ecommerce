import { Injectable } from '@nestjs/common';
import { CreateUserRequest, User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  create(createUserRequest: CreateUserRequest): User {
    const user: User = {
      id: this.nextId.toString(),
      email: createUserRequest.email,
      name: createUserRequest.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(user);
    this.nextId++;

    return user;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}
