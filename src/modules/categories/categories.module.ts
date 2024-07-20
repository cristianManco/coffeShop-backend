import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/auth/services/token.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, TokenService],
  exports: [],
})
export class CategoriesModule {}
