import { Controller, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common'
import { UploadService } from './upload.service'
import { Upload } from '../common/interfaces/global.interface'

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

    const measurement = await this.measurementService.createMeasurement(customer, image, measure_datetime, measure_type, 1500)
    const response = {
      "image_url": measurement.image,
      "measure_value": measurement.value,
      "measure_uuid": measurement.uuid
    }

    return response
  }
}
