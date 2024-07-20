import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { TokenService } from 'src/libs/auth/services/token.service';
import { AuthModule } from 'src/libs/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, TokenService],
  exports: [],
})
export class ProductsModule {}
