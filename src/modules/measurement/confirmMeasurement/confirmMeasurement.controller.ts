import { Body, Controller, HttpException, HttpStatus, Patch, UseFilters } from "@nestjs/common"
import { ConfirmMeasurementService } from "./confirmMeasurement.service"
import { ConfirmMeasurementBodyDTO } from "./dto/confirmMeasurement.dto"
import { ConfirmMeasurementValidationFilter } from "./dto/confirmMeasurementValidationException.filter"

@Controller()
export class ConfirmMeasurementController{
  constructor(private readonly confirmService: ConfirmMeasurementService) {}

  @Patch('confirm')
  @UseFilters(ConfirmMeasurementValidationFilter)
  async confirmMeasurement(@Body() body: ConfirmMeasurementBodyDTO) {
    const { measure_uuid, confirmed_value } = body

    const measurement = await this.confirmService.getMeasurement(measure_uuid)
    if (!measurement) {
      const response = {
        "error_code": "MEASURE_NOT_FOUND",
        "error_description": "Leitura do mês já realizada"
      }

      throw new HttpException(response, HttpStatus.NOT_FOUND)
    }

    const measurementHasAlreadyBeenConfirmed = measurement.confirmed
    if (measurementHasAlreadyBeenConfirmed) {
      const response = {
        "error_code": "CONFIRMATION_DUPLICATE",
        "error_description": "Leitura do mês já realizada"
      }

      throw new HttpException(response, HttpStatus.CONFLICT)
    }

    const confirmMeasurementResponse = await this.confirmService.confirmMeasurement(measurement, confirmed_value)

    const response = {
      "success": true
    }
    return response
  }
}