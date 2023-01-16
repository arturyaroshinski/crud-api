import { CustomError } from "./CustomError";

export class NotFoundRouteError extends CustomError {
    constructor() {
        super(`Path does not exist`);
    }
}
