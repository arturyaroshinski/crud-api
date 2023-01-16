import { CustomError } from "./CustomError";

export class NotFoundEntityError extends CustomError {
    constructor(id: string) {
        super(`Entity with id: ${id} not found!`);
    }
}
