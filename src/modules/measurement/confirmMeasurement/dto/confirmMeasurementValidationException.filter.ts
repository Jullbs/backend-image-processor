import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
  
@Catch(HttpException)
export class ConfirmMeasurementValidationFilter < T > implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    if (exception instanceof BadRequestException) {
      const errorDescription = exception.getResponse() as BadRequestException
      const customResponse = {
        "error_code": "INVALID_DATA",
        "error_description": errorDescription.message
      }

      response.status(exception.getStatus())
        .json(customResponse)
    } else {
      response.status(exception.getStatus()).json(exception.getResponse())
    }
  }
}