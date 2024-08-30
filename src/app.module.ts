import { Module } from '@nestjs/common'
import { UploadMeasurementController } from './modules/measurement/uploadMeasurement/uploadMeasurement.controller'
import { UploadMeasurementService } from './modules/measurement/uploadMeasurement/uploadMeasurement.service'
import { ListMeasurementController } from './modules/measurement/listMeasurement/listMeasurement.controller'
import { ListMeasurementService } from './modules/measurement/listMeasurement/listMeasurement.service'
import { ConfirmMeasurementController } from './modules/measurement/confirmMeasurement/confirmMeasurement.controller'
import { ConfirmMeasurementService } from './modules/measurement/confirmMeasurement/confirmMeasurement.service'
import { Customer, Measurement } from './common/entities/readings.enttity'
import { TypeOrmModule } from '@nestjs/typeorm'
import 'dotenv/config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres_db',
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Customer, Measurement],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Customer, Measurement]),
  ],
  controllers: [UploadMeasurementController, ListMeasurementController, ConfirmMeasurementController],
  providers: [UploadMeasurementService, ListMeasurementService, ConfirmMeasurementService],
})
export class AppModule {}
