import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  name: string;

  @IsString()
  @Length(1, 150)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  description: string;
}
