import { APIGatewayEvent } from "aws-lambda";

import { timeoutResponse } from "../app/template";

export const timeoutHandler = async ({
  queryStringParameters,
  requestContext: { stage },
}: APIGatewayEvent) => {
  const message = queryStringParameters?.message ?? "";

  return timeoutResponse(message, stage);
};
