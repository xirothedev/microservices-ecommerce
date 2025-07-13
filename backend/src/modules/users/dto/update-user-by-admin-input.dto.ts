import { Field } from "@nestjs/graphql";
import { Max, Min } from "class-validator";
import { UserFlag, UserRole } from "prisma/generated";
import { UserQL } from "../entities/user.entity";

export class UpdateUserByAdmin implements Partial<UserQL> {
  @Field(() => [UserRole])
  roles: UserRole[]

  @Field(() => [UserFlag])
  flags: UserFlag[]

  @Field()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  credit: number
}