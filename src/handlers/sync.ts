import { APIGatewayEvent } from "aws-lambda";
import fs from "fs";
import Handlebars from "handlebars";
import { resolve } from "path";
import { successResponse } from "../app/aws";
import { errorResponse } from "../app/template";

export const syncHandler = async (event: APIGatewayEvent) => {
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse();
  }

  const source = fs
    .readFileSync(resolve(__dirname, "../../templates/sync.html"))
    .toString();

  const template = Handlebars.compile(source);

  return successResponse(
    template({
      id: event.queryStringParameters.id,
    }),
  );
};
