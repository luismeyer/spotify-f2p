import { APIGatewayEvent } from "aws-lambda";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { refreshToken } from "../app/spotify";
import { clearPlaylist, loadSavedTracks, syncSavedTracks } from "../app";

export const syncHandler = async (event: APIGatewayEvent) => {
  const errorResponse = () => ({
    statusCode: 400,
    headers: {
      "Content-Type": "text/html",
    },
    body: fs
      .readFileSync(path.resolve(__dirname, "../../templates/error.html"))
      .toString(),
  });

  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse();
  }

  const token = await refreshToken(event.queryStringParameters.id);
  if (!token) {
    return errorResponse();
  }

  await clearPlaylist(token);
  console.info("Cleared Playlist");

  const savedTracksBatches = await loadSavedTracks(token);
  console.info("Loaded saved Tracks");

  await syncSavedTracks(token, savedTracksBatches);
  console.info("Saved tracks to playlist");

  const tracksCount = savedTracksBatches.reduce(
    (acc, curr) => curr.length + acc,
    0,
  );

  const source = fs
    .readFileSync(path.resolve(__dirname, "../../templates/sync.html"))
    .toString();

  const template = Handlebars.compile(source);

  const data = {
    songs: `${tracksCount} Song${tracksCount === 1 ? "" : "s"} wurden `,
    playlists: [
      {
        link: "https://google.com",
        name: "alles",
      },
    ],
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: template(data),
  };
};
