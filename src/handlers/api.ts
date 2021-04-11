import { APIGatewayEvent } from "aws-lambda";
import dotenv from "dotenv";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { successResponse } from "../app/aws";
import {
  clearPlaylist,
  loadSavedTracks,
  refreshToken,
  syncSavedTracks,
} from "../app/spotify";
import { errorResponse } from "../app/template";
import { countNestedArray } from "../app/utils";

export const apiHandler = async (event: APIGatewayEvent) => {
  console.log("APIHANDler", configPath);
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse();
  }

  const tokenResponse = await refreshToken(event.queryStringParameters.id);
  if (!tokenResponse) {
    return errorResponse();
  }

  const { token, url, playlistId } = tokenResponse;
  await clearPlaylist(token, playlistId);
  console.info("Cleared Playlist");

  const savedTracksBatches = await loadSavedTracks(token);
  console.info("Loaded saved Tracks");

  await syncSavedTracks(token, savedTracksBatches, playlistId);
  console.info("Saved tracks to playlist");

  const count = countNestedArray(savedTracksBatches);

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
