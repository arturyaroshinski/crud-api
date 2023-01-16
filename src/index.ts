import http, { IncomingMessage } from "http";
import { v4 as uuidv4 } from "uuid";
import { Controller } from "./Controller";
import { InvalidUUIDError } from "./Errors/InvalidInputError";
import { NotFoundEntityError } from "./Errors/NotFoundEntityError";
import { NotFoundRouteError } from "./Errors/NotFoundRouteError";
import { RequiredError } from "./Errors/RequiredError";
import { RequestMethod } from "./RequestMethod";
import { User, Entity } from "./User";
import { UserValidator } from "./Validators/UserValidator";
import * as dotenv from "dotenv";

dotenv.config();

let users: User[] = [{ id: uuidv4(), username: "name", age: 22, hobbies: [] }];

const controllers = new Map<string, Controller<Entity>>();
controllers.set("users", new Controller<User>(users, new UserValidator()));

const mapRequestToContoller = (req: IncomingMessage) => {
    const { url } = req;
    if (!url) throw new Error();

    const regex = /\/api\/(?<controller>\w*)\/?(?<param>.*)?/g;
    const groups = [...url.matchAll(regex)][0].groups;

    const controller = groups?.controller;
    const param = groups?.param;

    if (!controller) throw new Error();
    return { controller: controllers.get(controller), param };
};

const getBody = (req: IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk)).on("end", () => {
            resolve(body);
        });
        req.on("error", (err) => reject(err));
    });
};

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const { controller, param } = mapRequestToContoller(req);
    if (!controller) throw new NotFoundRouteError();

    const body = await getBody(req);

    let result: unknown;
    try {
        switch (req.method) {
            case RequestMethod.GET:
                result = param ? controller.getById(param) : controller.get();
                break;
            case RequestMethod.DELETE:
                result = controller.delete(param ?? "");
                res.statusCode = 204;
                break;
            case RequestMethod.POST:
                result = controller.post(JSON.parse(body));
                res.statusCode = 201;
                break;
            case RequestMethod.PUT:
                controller.put(param ?? "", JSON.parse(body));
                break;
            default:
                break;
        }

        res.end(JSON.stringify(result, null, 3));
    } catch (error) {
        if (error instanceof NotFoundEntityError) {
            res.statusCode = 404;
            res.end(error.message);
        } else if (error instanceof NotFoundRouteError) {
            res.statusCode = 404;
            res.end(error.message);
        } else if (error instanceof InvalidUUIDError) {
            res.statusCode = 400;
            res.end(error.message);
        } else if (error instanceof RequiredError) {
            res.statusCode = 400;
            res.end(error.message);
        } else {
            res.statusCode = 500;
            res.end("server error");
        }
    }
});

server.listen(Number(process.env.PORT), process.env.HOST, () => {
    console.log(
        `Server running at http://${process.env.HOST}:${process.env.PORT}/`
    );
});
