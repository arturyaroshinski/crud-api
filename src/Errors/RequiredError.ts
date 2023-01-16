import { CustomError } from "./CustomError";

export class RequiredError extends CustomError {
    constructor(property: string) {
        super(`${property} is required!`);
    }
}
