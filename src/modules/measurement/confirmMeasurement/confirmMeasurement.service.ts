import { InjectRepository } from '@nestjs/typeorm'
import { Measurement } from '../../../common/entities/readings.enttity'
import { Repository } from 'typeorm'

export class ConfirmMeasurementService {
  constructor(
    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>
  ) {}

  async getMeasurement(uuid: string) {
    const measurement = await this.measurementRepository.findOne({where: {uuid}})

    return measurement
  }

  async confirmMeasurement(measurement: Measurement, value: number) {
    measurement.value = value
    measurement.confirmed = true

    const confirmedMeasurement = await this.measurementRepository.save(measurement)

    return confirmedMeasurement
  }
}