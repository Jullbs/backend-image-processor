import { Module } from '@nestjs/common'
import { UploadController } from './modules/upload/upload.controller'
import { UploadService } from './modules/upload/upload.service'
import { Customer, Measurement } from './common/entities/readings.enttity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ListMeasurementController } from './modules/listMeasurement/listMeasurement.controller'
import { ListMeasurementService } from './modules/listMeasurement/listMeasurement.service'
import { ConfirmController } from './modules/confirmMeasurement/confirm.controller'
import { ConfirmService } from './modules/confirmMeasurement/confirm.service'
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
  controllers: [UploadController, ListMeasurementController, ConfirmController],
  providers: [UploadService, ListMeasurementService, ConfirmService],
})
export class AppModule {}
