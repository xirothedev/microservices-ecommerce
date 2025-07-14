import { Field, InputType } from '@nestjs/graphql';
import { IsPostalCode, MaxLength } from 'class-validator';
import { UserQL } from '../entities/user.entity';

@InputType()
export class UpdateUserInput implements Partial<UserQL> {
  @Field()
  @MaxLength(50)
  fullname: string;

  @Field()
  @MaxLength(500)
  address: string;

  @Field()
  @MaxLength(50)
  city: string;

  @Field()
  @MaxLength(50)
  state: string;

  @Field()
  @IsPostalCode()
  @MaxLength(10)
  zipCode: string;

  @Field()
  biography: string;
}
