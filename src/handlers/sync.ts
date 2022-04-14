import { APIGatewayEvent } from "aws-lambda";

import { errorResponse, syncResponse } from "../app/template";

export const syncHandler = async ({
  queryStringParameters,
  requestContext: { stage },
}: APIGatewayEvent) => {
  if (!queryStringParameters || !queryStringParameters.id) {
    return errorResponse(stage);
  }

  return syncResponse(queryStringParameters.id, stage);
};
