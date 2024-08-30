import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
  
@Catch()
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