import { Module } from '@nestjs/common';
import dbConfig from './libs/config/dbConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './libs/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig().database.host,
      port: dbConfig().database.port,
      username: dbConfig().database.username,
      password: dbConfig().database.password,
      database: dbConfig().database.db,
      autoLoadEntities: true,
      synchronize: false,
      extra: {
        ssl: false,
      },
    }),
    CategoriesModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
