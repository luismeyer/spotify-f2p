import { APIGatewayEvent } from "aws-lambda";

import { isLocal } from "../app/constants";
import { errorResponse, syncResponse } from "../app/template";

export const syncHandler = async ({
  queryStringParameters,
  requestContext: { stage },
}: APIGatewayEvent) => {
  if (!queryStringParameters || !queryStringParameters.id) {
    return errorResponse();
  }

  const baseUrl = !isLocal && stage ? `/${stage}` : "";

  return syncResponse(queryStringParameters.id, baseUrl);
};
