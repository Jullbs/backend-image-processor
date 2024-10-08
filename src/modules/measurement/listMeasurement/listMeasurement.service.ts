import { InjectRepository } from '@nestjs/typeorm'
import { Customer, Measurement } from '../../../common/entities/readings.enttity'
import { Repository } from 'typeorm'
import { CustomerCode, MeasureType } from '../../../common/interfaces/global.interface'

export class ListMeasurementService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>
  ) {}

  async getCustomer(customerCode: CustomerCode) {
    const customer = await this.customerRepository.findOne({where: {customer_code: customerCode}})

    return customer
  }

  async getMeasurements(customer: Customer, type?: MeasureType) {
    const query = this.measurementRepository
    .createQueryBuilder('measurement')
    .select([
      'measurement.uuid AS measure_uuid',
      'measurement.datetime AS measure_datetime',
      'measurement.type AS measure_type',
      'measurement.confirmed AS has_confirmed',
      'measurement.image AS image_url'
    ])
    .where('measurement.customerId = :customerId', { customerId: customer.id })

    if (type) {
      query.andWhere('measurement.type = :type', { type })
    }

    const measurements = await query.getRawMany()
    return measurements
  }
}