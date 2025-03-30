import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(3)
  @IsOptional()
  fullName?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsEnum(ValidRoles, { each: true })
  @Field(() => [ValidRoles], { nullable: true })
  @IsOptional()
  roles?: string[];

  @Field(() => String, { nullable: true })
  @MinLength(6)
  @IsOptional()
  password?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActive?: boolean;
}
