import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {

    return (object: any, propertyName: string) => {
        if (validationOptions === undefined) {
            validationOptions = {
                message: `${propertyName.replace('_', ' ')} must same with ${property.replace('_', ' ')}`
            }
        } else if (validationOptions.message === undefined) {
            validationOptions.message = `${propertyName.replace('_', ' ')} must same with ${property.replace('_', ' ')}`;
        }
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }
}