import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from 'src/libs/auth/auth.module';
import { TokenService } from 'src/libs/auth/services/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product, User]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, TokenService],
})
export class OrdersModule {}
