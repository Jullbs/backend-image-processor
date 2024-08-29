export type MeasureType = "WATER" | "GAS"

export type CustomerCode = string

export interface Upload {
  image: string,
  customer_code: CustomerCode,
  measure_datetime: Date,
  measure_type: MeasureType
}