import { InjectRepository } from '@nestjs/typeorm'
import { Measurement } from '../common/entities/readings.enttity'
import { Repository } from 'typeorm'

export class ConfirmService {
  constructor(
    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>
  ) {}

  async getMeasurement(uuid: string) {
    const measurement = await this.measurementRepository.findOne({where: {uuid}})

    return measurement
  }

  async checkMeasurementStatus(uuid: string) {
    const measurementStatus = await this.measurementRepository.findOne({where: {uuid}, select: ['confirmed']})

    return measurementStatus.confirmed
  }

  async confirmMeasurement(uuid: string, value: number) {
    const measurement = await this.measurementRepository.findOne({where: {uuid}})

    measurement.value = value
    measurement.confirmed = true

    const confirmedMeasurement = await this.measurementRepository.save(measurement)

    return confirmedMeasurement
  }
}