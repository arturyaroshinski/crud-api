import { CustomError } from "./CustomError";

export class InvalidUUIDError extends CustomError {
    constructor(id: string) {
        super(`${id} is not valid uuid`);
    }
}
