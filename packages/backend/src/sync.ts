import { SyncLambdaPayload } from "@spotify-f2p/api";
import { errorResponse, invokeSyncLambda } from "@spotify-f2p/aws";
import {
  loadPlaylistTrackIds,
  loadSavedTrackIds,
  refreshToken,
} from "@spotify-f2p/spotify";

import { syncResponse } from "./response";

const { SYNC_LAMBDA } = process.env;
if (!SYNC_LAMBDA) {
  throw new Error("Missing Env: SYNC_LAMBDA");
}

export const handleId = async (id: string) => {
  const dbResponse = await refreshToken(id);
  if (!dbResponse) {
    return errorResponse("DB Error");
  }

  const { token, playlistId, url } = dbResponse;
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

  await invokeSyncLambda<SyncLambdaPayload>(SYNC_LAMBDA, {
    addTracks,
    deleteTracks,
    playlistId,
    token,
  });

  const count = deleteTracks.length + addTracks.length;

  return syncResponse(count, url ?? "hier fehlt was");
};
