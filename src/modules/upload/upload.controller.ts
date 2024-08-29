import { Controller, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common'
import { UploadService } from './upload.service'
import { Upload } from '../common/interfaces/global.interface'
import { v4 as uuidv4 } from 'uuid'

@Controller('upload')
export class UploadController {
  constructor(private readonly measurementService: UploadService) {}

  @Post()
  @HttpCode(200)
  async uploadMeasurement(@Body() parameters: Upload) {
    const { customer_code, image, measure_datetime, measure_type } = parameters

    const customer = await this.measurementService.getCustomer(customer_code)
    const customerHasMeasurementInMonth = await this.measurementService.checkCustomerHasMeasurementInMonth(customer, measure_datetime, measure_type)

    if (customerHasMeasurementInMonth) {
      const response = {
        "error_code": "DOUBLE_REPORT",
        "error_description": "Leitura do mês já realizada"
       }
       
      throw new HttpException(response, HttpStatus.CONFLICT) 
    }

    const measureUuid = uuidv4()
    const uploadMeasurementImageResponse = await this.measurementService.uploadMeasurementImage(measureUuid, image, measure_type)
    const measureValue = await this.measurementService.getMeasurementValue(uploadMeasurementImageResponse, measure_type)

    const measurement = await this.measurementService.createMeasurement(measureUuid, customer, image, measure_datetime, measure_type, measureValue)
    const response = {
      "image_url": uploadMeasurementImageResponse.file.uri,
      "measure_value": measurement.value,
      "measure_uuid": measurement.uuid
    }

    return response
  }
}
