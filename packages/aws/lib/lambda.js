"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeSyncLambda = exports.successResponse = exports.errorResponse = void 0;
const aws_sdk_1 = require("aws-sdk");
const dev_1 = require("./dev");
const config = dev_1.isDev
    ? {
        region: "localhost",
        endpoint: "http://localhost:3002",
        accessKeyId: "DEFAULT_ACCESS_KEY",
        secretAccessKey: "DEFAULT_SECRET",
    }
    : { region: "eu-central-1" };
const lambda = new aws_sdk_1.Lambda(config);
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};
const errorResponse = (message) => ({
    statusCode: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
    body: JSON.stringify({
        success: false,
        message,
    }),
});
exports.errorResponse = errorResponse;
const successResponse = (content) => ({
    statusCode: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
    body: JSON.stringify({
        success: true,
        ...content,
    }),
});
exports.successResponse = successResponse;
const invokeSyncLambda = (name, payload) => {
    return lambda
        .invoke({
        FunctionName: name,
        InvocationType: "Event",
        Payload: JSON.stringify(payload),
    })
        .promise();
};
exports.invokeSyncLambda = invokeSyncLambda;
//# sourceMappingURL=lambda.js.map