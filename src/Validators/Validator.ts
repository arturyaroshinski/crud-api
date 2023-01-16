import { CustomError } from "../Errors/CustomError";
import { Entity } from "../User";

type validationFunction<T> = (prop: T) => boolean;
export type propValidator<T> = {
    property: keyof T;
    fn: validationFunction<T[keyof T]>;
    error: typeof CustomError;
};

export interface IValidator<T> {
    validate(entity: T): void | never;
}

export abstract class Validator<T extends Entity> implements IValidator<T> {
    validate(entity: T): void | never {
        this.propValidators.forEach(({ property, fn, error }) => {
            const isValid = fn(entity[property]);
            if (!isValid) throw new error(property);
        });
    }

    constructor(protected propValidators: propValidator<T>[]) {}
}
