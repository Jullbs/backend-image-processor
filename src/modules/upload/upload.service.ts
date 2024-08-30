import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Customer, Measurement } from '../../common/entities/readings.enttity'
import { Repository } from 'typeorm'
import { CustomerCode, MeasureType } from '../../common/interfaces/global.interface'
import { join } from 'path'
import { unlinkSync, writeFileSync } from 'fs'
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server"
import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

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

  async uploadMeasurementImage(uuid: string, image: string, type: MeasureType) {
    const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/)
    const mimeType = mimeTypeMatch[1]

    const imageWithoutPrefix = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(imageWithoutPrefix, 'base64')
    const localImagePath = join(__dirname, '..', 'common', `${uuid}.jpg`)
    writeFileSync(localImagePath, buffer)
    
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!)
    const uploadFileResponse = await fileManager.uploadFile(localImagePath, {
      mimeType: mimeType,
      displayName: `${type} Measurement`,
    })

    unlinkSync(localImagePath)

    return uploadFileResponse
  }

  async getMeasurementValue(upload: UploadFileResponse, type: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
    const prompt = `Identify the value of this ${type} measurement and return in the response only the value identified.`

    const generateContentResponse = await model.generateContent([
      {
        fileData: {
          mimeType: upload.file.mimeType,
          fileUri: upload.file.uri
        }
      },
      { text: prompt }
    ])

    const measureValue = generateContentResponse.response.text()
    return parseInt(measureValue)
  }

  async createMeasurement(uuid: string, customer: Customer, image: string, dateTime: Date, type: MeasureType, value: number) {
    const measurementData = {
        "uuid": uuid,
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
