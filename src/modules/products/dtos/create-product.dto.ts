import { IsString, IsInt, Length, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Multimedia URL of the product' })
  @IsString()
  @Length(1, 755)
  multimedia_url: string;

  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsInt()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Category ID of the product' })
  @IsInt()
  id_category: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  stock: number;
}
