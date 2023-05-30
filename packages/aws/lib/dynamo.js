"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.updateUser = exports.saveUser = void 0;
const duenamodb_1 = require("duenamodb");
const dev_1 = require("./dev");
const params = dev_1.isDev
    ? {
        region: "localhost",
        endpoint: "http://localhost:8000",
        accessKeyId: "DEFAULT_ACCESS_KEY",
        secretAccessKey: "DEFAULT_SECRET",
    }
    : { region: "eu-central-1" };
duenamodb_1.DDBClient.params = params;
const { TABLE_NAME } = process.env;
if (!TABLE_NAME) {
    throw new Error("Missing Env Variable: TABLE_NAME");
}
exports.saveUser = (0, duenamodb_1.createPutItem)(TABLE_NAME);
exports.updateUser = (0, duenamodb_1.createUpdateItem)(TABLE_NAME, "id");
exports.getUser = (0, duenamodb_1.createGetItem)(TABLE_NAME, "id");
//# sourceMappingURL=dynamo.js.map