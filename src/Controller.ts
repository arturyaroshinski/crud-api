import { v4 as uuidv4, validate as isUUID } from "uuid";
import { InvalidUUIDError } from "./Errors/InvalidInputError";
import { NotFoundEntityError } from "./Errors/NotFoundEntityError";
import { Entity } from "./User";
import { IValidator } from "./Validators/Validator";

export class Controller<T extends Entity> {
    constructor(private data: T[], private validator: IValidator<T>) {}

    get(): T[] {
        return this.data;
    }

    getById(id: string): T {
        if (!isUUID(id)) throw new InvalidUUIDError(id);

        const entity = this.data.find((entity) => entity.id === id);
        if (!entity) throw new NotFoundEntityError(id);

        return entity;
    }

    post(entity: T): T {
        this.validator?.validate(entity);
        entity.id = uuidv4();
        this.data.push(entity);
        return entity;
    }

    delete(id: string) {
        if (!isUUID(id)) throw new InvalidUUIDError(id);
        const entity = this.data.find((entity) => entity.id === id);

        if (!entity) throw new NotFoundEntityError(id);
        this.data = this.data.filter((e) => e !== entity);
    }

    put(id: string, entity: T) {
        this.validator?.validate(entity);
        Object.assign(this.getById(id), { ...entity, id });
    }
}
