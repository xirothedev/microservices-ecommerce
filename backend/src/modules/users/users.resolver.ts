import { Roles } from '@/common/decorators/role.decorator';
import { Req } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { UpdateUserByAdmin } from './dto/update-user-by-admin-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { UserQL } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserQL)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserQL, { name: 'me' })
  findMe(@Req() req: Request) {
    return req.user;
  }

  @Roles('ADMINISTRATOR', 'SUPPORTER')
  @Query(() => UserQL, { name: 'user' })
  findUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findUser(id);
  }

  @Mutation(() => UserQL)
  updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('input', { type: () => UpdateUserInput }) input: UpdateUserInput,
  ) {
    return this.usersService.updateUser(id, input);
  }

  @Mutation(() => UserQL)
  @Roles('ADMINISTRATOR')
  updateAdminUser(
    @Args('id', { type: () => String }) id: string,
    @Args('input', { type: () => UpdateUserByAdmin }) input: UpdateUserByAdmin,
  ) {
    return this.usersService.updateUserByAdmin(id, input);
  }
}
