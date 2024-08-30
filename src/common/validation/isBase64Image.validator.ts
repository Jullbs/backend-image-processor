import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false
          const regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/
          
          return regex.test(value)
        },
        defaultMessage(args: ValidationArguments) {
          return 'image must be a valid base64 encoded string with a proper prefix (e.g., data:image/jpeg;base64,...)'
        },
      },
    })
  }
}
