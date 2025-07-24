import { Field, InputType } from '@nestjs/graphql';
import { IsPostalCode, MaxLength } from 'class-validator';
import { UserQL } from '../entities/user.entity';

@InputType()
export class UpdateUserInput implements Partial<UserQL> {
  @Field({ nullable: true })
  @MaxLength(50)
  fullname?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  address?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  city?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  state?: string;

  @Field({ nullable: true })
  @IsPostalCode()
  @MaxLength(10)
  zipCode?: string;

  @Field({ nullable: true })
  biography?: string;
}
