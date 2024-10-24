import type { ProxyResult } from "aws-lambda";

import {
  InvokeCommand,
  LambdaClient,
  type LambdaClientConfig,
} from "@aws-sdk/client-lambda";

import { isDev } from "./dev";

const config: LambdaClientConfig = isDev
  ? {
      region: "localhost",
      endpoint: "http://localhost:3002",
      credentials: {
        accessKeyId: "DEFAULT_ACCESS_KEY",
        secretAccessKey: "DEFAULT_SECRET",
      },
    }
  : { region: "eu-central-1" };

const lambda = new LambdaClient(config);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const errorResponse = (message: string): ProxyResult => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json", ...corsHeaders },
  body: JSON.stringify({
    success: false,
    message,
  }),
});

export const successResponse = <T extends object>(content: T): ProxyResult => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json", ...corsHeaders },
  body: JSON.stringify({
    success: true,
    ...content,
  }),
});

export const invokeAsyncLambda = <T extends object>(
  name: string,
  payload: T,
) => {
  const command = new InvokeCommand({
    FunctionName: name,
    InvocationType: "Event",
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  return lambda.send(command);
};
