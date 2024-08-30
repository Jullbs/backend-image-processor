import { Module } from '@nestjs/common'
import { UploadController } from './modules/upload/upload.controller'
import { UploadService } from './modules/upload/upload.service'
import { Customer, Measurement } from './modules/common/entities/readings.enttity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MeasurementListController } from './modules/measurementList/measurementList.controller'
import { MeasurementListService } from './modules/measurementList/measurementList.service'
import { ConfirmController } from './modules/confirm/confirm.controller'
import { ConfirmService } from './modules/confirm/confirm.service'
import 'dotenv/config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Customer, Measurement],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Customer, Measurement]),
  ],
  controllers: [UploadController, MeasurementListController, ConfirmController],
  providers: [UploadService, MeasurementListService, ConfirmService],
})
export class AppModule {}
