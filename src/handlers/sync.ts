import { APIGatewayEvent } from "aws-lambda";
import { errorResponse, syncResponse } from "../app/template";

const { STAGE } = process.env;

export const syncHandler = async (event: APIGatewayEvent) => {
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse();
  }

  return syncResponse(event.queryStringParameters.id, STAGE ? `/${STAGE}` : "");
};
