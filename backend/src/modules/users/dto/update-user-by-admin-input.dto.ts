import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, Max, Min } from 'class-validator';
import { UserFlag, UserRole } from 'prisma/generated';
import { UserQL } from '../entities/user.entity';

@InputType()
export class UpdateUserByAdmin implements Partial<UserQL> {
  @Field(() => [UserRole])
  @IsEnum(UserRole, { each: true })
  @IsArray()
  roles: UserRole[];

  @Field(() => [UserFlag])
  @IsEnum(UserFlag, { each: true })
  @IsArray()
  flags: UserFlag[];

  @Field()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  credit: number;
}
