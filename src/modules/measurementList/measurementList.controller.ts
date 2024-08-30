import { Controller, Get, HttpException, HttpStatus, Param, Query, UseFilters } from "@nestjs/common"
import { MeasurementListService } from "./measurementList.service"
import { GetMeasurementListParamsDTO, GetMeasurementListQueryDTO } from "./dto/measurementList.dto"
import { GetMeasurementListValidationFilter } from "./dto/validation-exception.filter"


@Controller()
export class MeasurementListController{
  constructor(private readonly listService: MeasurementListService) {}

  @Get(':customer_code/list')
  @UseFilters(GetMeasurementListValidationFilter)
  async getMeasurementList(@Param() params: GetMeasurementListParamsDTO, @Query() query: GetMeasurementListQueryDTO) {
    const customer = await this.listService.getCustomer(params.customer_code)
    const measurements = await this.listService.getMeasurements(customer, query.measure_type)

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