import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  fullName: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6)
  @IsString()
  @Field(() => String)
  password: string;
}
