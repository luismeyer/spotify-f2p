import { APIGatewayEvent } from "aws-lambda";
import dotenv from "dotenv";
import path from "path";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import {
  removeTrackIdsFromPlaylist,
  loadPlaylistTrackIds,
  loadSavedTrackIds,
  refreshToken,
  addTrackIdsToPlaylist,
} from "../app/spotify";
import { apiResponse, errorResponse } from "../app/template";

export const apiHandler = async (event: APIGatewayEvent) => {
  console.log("APIHANDler", configPath);
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse(event.requestContext.stage);
  }

  const dbResponse = await refreshToken(event.queryStringParameters.id);
  if (!dbResponse) {
    return errorResponse(event.requestContext.stage);
  }

  const { token, url, playlistId } = dbResponse;

  const playlistTracks = await loadPlaylistTrackIds(token, playlistId);

  const savedTracks = await loadSavedTrackIds(token);
  console.info("Loaded saved Tracks");

  // assume by default that all songs will be removed
  let deleteTracks: string[] = playlistTracks;
  let addTracks: string[] = [];

  // check all saved songs
  savedTracks.forEach((track) => {
    // add song to playlist if its missing
    if (!playlistTracks.includes(track)) {
      addTracks = [...addTracks, track];
      return;
    }

    // remove song from the to be deleted songs
    const trackIndex = deleteTracks.indexOf(track);

    deleteTracks = [
      ...deleteTracks.slice(0, trackIndex),
      ...deleteTracks.slice(trackIndex + 1, deleteTracks.length),
    ];
  });

  await removeTrackIdsFromPlaylist(token, playlistId, deleteTracks);
  console.info("Cleared Playlist");

  await addTrackIdsToPlaylist(token, addTracks, playlistId);
  console.info("Saved tracks to playlist");

  const count = deleteTracks.length + addTracks.length;

  return apiResponse(
    `${count} Song${count === 1 ? "" : "s"} wurden synchronisiert`,
    url,
  );
};
