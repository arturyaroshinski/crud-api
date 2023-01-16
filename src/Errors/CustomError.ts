export class CustomError extends Error {
    constructor(message: string | number | symbol) {
        super(message.toString());
    }
}
