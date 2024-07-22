import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({ description: 'Description of the category' })
  @IsString()
  @Length(1, 150)
  description: string;
}
