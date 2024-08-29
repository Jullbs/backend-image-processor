import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Customer, Measurement } from '../common/entities/readings.enttity'
import { Repository } from 'typeorm'
import { CustomerCode, MeasureType } from '../common/interfaces/global.interface'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>
  ) {}

  async getCustomer(customerCode: CustomerCode) {
    const customer = await this.customerRepository.findOne({where: {customer_code: customerCode}})

    if(!customer) {
      const newCustomerEntity = this.customerRepository.create({customer_code: customerCode})
      const newCostumer = await this.customerRepository.save(newCustomerEntity)

      return newCostumer
    }

    return customer
  }

  async checkCustomerHasMeasurementInMonth(customer: Customer, dateTime: Date, type: MeasureType) {
    const measurementDate = new Date(dateTime)
    const measurementYear = measurementDate.getUTCFullYear()
    const measurementMonth = measurementDate.getUTCMonth() + 1

    const customerMeasurementInMonth = await this.measurementRepository
      .createQueryBuilder('measurement')
      .where('measurement.customerId = :customerId', { customerId: customer.id })
      .andWhere('measurement.type = :type', { type })
      .andWhere('EXTRACT(YEAR FROM measurement.datetime::timestamp) = :measurementYear', { measurementYear })
      .andWhere('EXTRACT(MONTH FROM measurement.datetime::timestamp) = :measurementMonth', { measurementMonth })
      .getOne()

    return Boolean(customerMeasurementInMonth)
  }

  async createMeasurement(customer: Customer, image: string, dateTime: Date, type: MeasureType, value: number) {
    const measureUuid = uuidv4()
    const measurementData = {
        "uuid": measureUuid,
        "image": image,
        "datetime": dateTime,
        "type": type,
        "value": value,
        "confirmed": false,
        "customer": customer
      }


    const newMeasurement = this.measurementRepository.create(measurementData)
    return await this.measurementRepository.save(newMeasurement)
  }
}
