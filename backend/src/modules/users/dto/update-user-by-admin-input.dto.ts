import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, Max, Min } from 'class-validator';
import { UserFlag, UserRole } from 'prisma/generated';
import { UserQL } from '../entities/user.entity';

export const AssignableUserRole = {
  SUPPORTER: UserRole.SUPPORTER,
  COLLABORATOR: UserRole.COLLABORATOR,
  SELLER: UserRole.SELLER,
  USER: UserRole.USER,
} as const;
export type AssignableUserRole = (typeof AssignableUserRole)[keyof typeof AssignableUserRole];

@InputType()
export class UpdateUserByAdmin implements Partial<UserQL> {
  @Field(() => [UserRole])
  @IsEnum(AssignableUserRole, { each: true })
  @IsArray()
  roles: AssignableUserRole[];

  @Field(() => [UserFlag])
  @IsEnum(UserFlag, { each: true })
  @IsArray()
  flags: UserFlag[];

  @Field()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  credit: number;
}
