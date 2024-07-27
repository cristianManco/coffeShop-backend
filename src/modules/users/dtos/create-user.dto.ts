import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  Length,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  name: string;

  @Length(1, 50)
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength(50, {
    message: 'The password must have maximum of 50 characters ',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @Length(1, 15)
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  phone: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  role?: string;
}
