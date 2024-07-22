import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @MinLength(8, { message: 'The password must be at least 8 characters' })
  @MaxLength(50, {
    message: 'The password must have a maximum of 100 characters',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
