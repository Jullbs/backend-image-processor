import { Module } from '@nestjs/common'
import { UploadController } from './modules/upload/upload.controller'
import { UploadService } from './modules/upload/upload.service'

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [UploadService],
})
export class AppModule {}
