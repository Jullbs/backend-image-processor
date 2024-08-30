import { IsInt, IsString } from "class-validator"

export class ConfirmMeasurementBodyDTO {
  @IsString()
  measure_uuid: string

  @IsInt()
  confirmed_value: number
}