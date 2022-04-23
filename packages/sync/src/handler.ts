import { APIGatewayProxyHandler } from "aws-lambda";

import {
  addTrackIdsToPlaylist,
  loadPlaylistTrackIds,
  loadSavedTrackIds,
  refreshToken,
  removeTrackIdsFromPlaylist,
} from "@spotify-f2p/spotify";
import { errorResponse } from "@spotify-f2p/aws";
import { syncResponse } from "./response";

export const handle: APIGatewayProxyHandler = async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return errorResponse("Missing params");
  }

  const dbResponse = await refreshToken(event.queryStringParameters.id);
  if (!dbResponse) {
    return errorResponse("DB Error");
  }

  const { token, playlistId } = dbResponse;
  if (!playlistId) {
    return errorResponse("Missing playlist id");
  }

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

  return syncResponse(count);
};
