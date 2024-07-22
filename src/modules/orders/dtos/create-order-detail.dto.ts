import { IsInt, IsDecimal } from 'class-validator';

export class CreateOrderDetailDto {
  @IsInt()
  id_order: number;

  @IsInt()
  id_product: number;

  @IsInt()
  quantity: number;

  @IsDecimal()
  unit_price: number;
}
