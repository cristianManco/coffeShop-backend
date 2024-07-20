import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { Transform, Type } from 'class-transformer';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiProperty()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  @ApiProperty()
  order_details: CreateOrderDetailDto[];
}
