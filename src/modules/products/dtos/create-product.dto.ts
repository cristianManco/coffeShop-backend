import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  IsInt,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  stock: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  category_id: number;
}
