import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './commons/config/configuration';
import entities from './TASK/entities';
import { TaskModule } from './TASK/task.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
  }),
  TaskModule,TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [...entities],
    synchronize: true,
  })],
  controllers: [],
  providers: []
})
export class AppModule {}
