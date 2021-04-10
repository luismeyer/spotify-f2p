import { APIGatewayEvent } from "aws-lambda";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { errorResponse } from "../app/template";
import { countNestedArray } from "../app/utils";
import { successResponse } from "../app/aws";
import {
  clearPlaylist,
  loadSavedTracks,
  syncSavedTracks,
  refreshToken,
} from "../app/spotify";

const sync = async (token: string): Promise<string[][]> => {
  await clearPlaylist(token);
  console.info("Cleared Playlist");

  const savedTracksBatches = await loadSavedTracks(token);
  console.info("Loaded saved Tracks");

  await syncSavedTracks(token, savedTracksBatches);
  console.info("Saved tracks to playlist");

  return savedTracksBatches;
};

export const apiHandler = async (event: APIGatewayEvent) => {
  console.log("APIHANDler", configPath);
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse();
  }

  const tokenResponse = await refreshToken(event.queryStringParameters.id);
  if (!tokenResponse) {
    return errorResponse();
  }

  const { token, url } = tokenResponse;
  const count = countNestedArray(await sync(token));

  const source = fs
    .readFileSync(path.resolve(__dirname, "../../templates/api.html"))
    .toString();

  const template = Handlebars.compile(source);

  const data = {
    songs: `${count} Song${count === 1 ? "" : "s"} wurden `,
    bitlyUrl: url,
  };

  return successResponse(template(data));
};
