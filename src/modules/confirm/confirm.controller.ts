import { Body, Controller, HttpException, HttpStatus, Patch } from "@nestjs/common"
import { Confirm } from "../common/interfaces/global.interface"
import { ConfirmService } from "./confirm.service"

@Controller()
export class ConfirmController{
  constructor(private readonly confirmService: ConfirmService) {}

  @Patch('confirm')
  async confirmMeasurement(@Body() parameters: Confirm) {
    const { measure_uuid, confirmed_value } = parameters

    const measurement = await this.confirmService.getMeasurement(measure_uuid)
    if (!measurement) {
      const response = {
        "error_code": "MEASURE_NOT_FOUND",
        "error_description": "Leitura do mês já realizada"
      }

      throw new HttpException(response, HttpStatus.NOT_FOUND)
    }

    const measurementHasAlreadyBeenConfirmed = await this.confirmService.checkMeasurementStatus(measure_uuid)
    if (measurementHasAlreadyBeenConfirmed) {
      const response = {
        "error_code": "CONFIRMATION_DUPLICATE",
        "error_description": "Leitura do mês já realizada"
      }

      throw new HttpException(response, HttpStatus.CONFLICT)
    }

    const confirmMeasurementResponse = await this.confirmService.confirmMeasurement(measure_uuid, confirmed_value)

    const response = {
      "success": true
    }
    return response
  }
}