import { Module } from '@nestjs/common';
import dbConfig from './libs/config/dbConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
      synchronize: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
