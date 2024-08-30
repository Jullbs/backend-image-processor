import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, UseFilters } from '@nestjs/common'
import { UploadMeasurementService } from './uploadMeasurement.service'
import { UploadMeasurementBodyDTO } from './dto/uploadMeasurement.dto'
import { v4 as uuidv4 } from 'uuid'
import { UploadMeasurementValidationFilter } from './dto/uploadMeasurementValidationException.filter'


@Controller('upload')
export class UploadMeasurementController {
  constructor(private readonly measurementService: UploadMeasurementService) {}

  @Post()
  @HttpCode(200)
  @UseFilters(UploadMeasurementValidationFilter)
  async uploadMeasurement(@Body() body: UploadMeasurementBodyDTO) {
    const { customer_code, image, measure_datetime, measure_type } = body

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

    const imageUrl = uploadMeasurementImageResponse.file.uri
    const measurement = await this.measurementService.createMeasurement(measureUuid, customer, imageUrl, measure_datetime, measure_type, measureValue)
    const response = {
      "image_url": imageUrl,
      "measure_value": measurement.value,
      "measure_uuid": measurement.uuid
    }

    return response
  }
}
