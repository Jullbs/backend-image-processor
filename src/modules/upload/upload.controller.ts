import { Controller, Post, Body, UsePipes } from '@nestjs/common'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly readingService: UploadService) {}

  @Post()
  uploadImage(@Body() data: any) {
    const { image, customer_code, measure_datetime, measure_type } = data

    return this.readingService.createReading(data)
  }
}
