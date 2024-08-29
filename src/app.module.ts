import { Module } from '@nestjs/common'
import { UploadController } from './modules/upload/upload.controller'
import { UploadService } from './modules/upload/upload.service'
import { Customer, Measurement } from './modules/common/entities/readings.enttity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ListController } from './modules/list/list.controller'
import { ListService } from './modules/list/list.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'consumptionreading',
      entities: [Customer, Measurement],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Customer, Measurement]),
  ],
  controllers: [UploadController, ListController],
  providers: [UploadService, ListService],
})
export class AppModule {}
