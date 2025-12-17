import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'dv7_user',
      password: process.env.DB_PASSWORD || 'dv7_password',
      database: process.env.DB_NAME || 'dv7_nexus',
      autoLoadEntities: true,
      synchronize: true, // Only use this in development
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}