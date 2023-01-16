export abstract class Entity {
    id!: string;
}

export class User extends Entity {
    username!: string;
    age!: number;
    hobbies: string[] = [];
}
