import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login-user.dto';

export class RegisterDto extends LoginDto {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  name: string;

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
