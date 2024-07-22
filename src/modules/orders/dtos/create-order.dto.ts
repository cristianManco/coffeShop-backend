import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  id_client: number;

  @IsEnum(['delivered', 'shipped', 'confirmed', 'pending'])
  status: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  order_details: CreateOrderDetailDto[];
}
