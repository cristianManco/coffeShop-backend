import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @IsInt()
  @Min(1)
  @ApiProperty()
  product_id: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;
}
