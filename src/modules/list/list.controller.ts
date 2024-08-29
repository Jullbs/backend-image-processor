import { Controller, Get, HttpException, HttpStatus, Param, Query } from "@nestjs/common";
import { ListService } from "./list.service";
import { MeasureType } from "../common/interfaces/global.interface";

@Controller()
export class ListController{
  constructor(private readonly listService: ListService) {}

  @Get(':customer_code/list')
  async getList(@Param('customer_code') customer_code: string, @Query('measure_type') type: MeasureType) {
    const customer = await this.listService.getCustomer(customer_code)
    const measurements = await this.listService.getMeasurements(customer, type)

    if (measurements.length === 0) {
      const response = {
        "error_code": "MEASURES_NOT_FOUND",
        "error_description": "Nenhuma leitura encontrada"
      }

      throw new HttpException(response, HttpStatus.NOT_FOUND) 
    }

    const response = {
      "customer_code": customer.customer_code,
      "measures": measurements
    }
    return response
  }
}