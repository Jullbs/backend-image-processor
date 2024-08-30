import { Transform } from "class-transformer"
import { IsDateString, IsIn, IsString } from "class-validator"
import { MeasureType } from "src/common/interfaces/global.interface"
import { IsBase64Image } from "src/common/validation/isBase64Image.validator"

export class UploadMeasurementBodyDTO {
  @IsBase64Image()
  image: string

  @IsString()
  customer_code: string

  @IsDateString()
  measure_datetime: Date

  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(['WATER', 'GAS'])
  measure_type: MeasureType
}