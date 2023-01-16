import { RequiredError } from "../Errors/RequiredError";
import { User } from "../User";
import { propValidator, Validator } from "./Validator";

export class UserValidator extends Validator<User> {
    constructor() {
        const validators: propValidator<User>[] = [
            {
                property: "username",
                fn: (username) =>
                    Boolean(username.toString()) &&
                    username.toString().length > 0,
                error: RequiredError,
            },
            {
                property: "age",
                fn: (age) => !!Number(age),
                error: RequiredError,
            },
            {
                property: "hobbies",
                fn: (hobbies) => Array.isArray(hobbies),
                error: RequiredError,
            },
        ];

        super(validators);
    }
}
