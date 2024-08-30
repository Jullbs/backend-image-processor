import { IsIn, IsOptional, IsString } from "class-validator"
import { MeasureType } from "../../../../common/interfaces/global.interface"
import { Transform } from "class-transformer"

export class GetMeasurementListParamsDTO {
  @IsString()
  customer_code: string
}

export class GetMeasurementListQueryDTO {
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsIn(['WATER', 'GAS'])
  measure_type?: MeasureType
}