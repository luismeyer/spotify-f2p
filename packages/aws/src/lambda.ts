import { ProxyResult } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { isDev } from "./dev";

const lambda = new Lambda({
  region: "eu-central-1",
  endpoint: isDev ? "http://localhost:3002" : undefined,
});

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

export const invokeSyncLambda = <T extends object>(
  name: string,
  payload: T,
) => {
  return lambda
    .invoke({
      FunctionName: name,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    })
    .promise();
};
