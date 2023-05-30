import { Handler } from "aws-lambda";

import { SyncLambdaPayload } from "@spotify-f2p/api";
import {
  addTrackIdsToPlaylist,
  loadPlaylistTrackIds,
  loadSavedTrackIds,
  removeTrackIdsFromPlaylist,
} from "@spotify-f2p/spotify";

export const handle: Handler<SyncLambdaPayload, "success" | "error"> = async ({
  token,
  playlistId,
}) => {
  if (!token || !playlistId) {
    return "error";
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

  return "success";
};
