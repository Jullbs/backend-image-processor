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
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse())
    } else {
      const customResponse = {
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "An unexpected error occurred.",
      }

      response.status(500).json(customResponse)
    }
  }
}