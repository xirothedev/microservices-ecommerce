import { Roles } from '@/common/decorators/role.decorator';
import { GqlContext } from '@/typings/gql';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserByAdmin } from './dto/update-user-by-admin-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { UserQL } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserQL)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserQL, { name: 'me' })
  findMe(@Context() context: GqlContext) {
    return context.req.user;
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
