import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  name: string;

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

  @IsString()
  @Length(1, 15)
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  telephone: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  role?: string;
}
