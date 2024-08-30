import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
  
@Catch()
export class GetMeasurementListValidationFilter < T > implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    if (exception instanceof BadRequestException) {
      const customResponse = {
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      }

      response.status(exception.getStatus())
        .json(customResponse)
    } else {
      response.status(exception.getStatus()).json(exception.getResponse())
    }
  }
}