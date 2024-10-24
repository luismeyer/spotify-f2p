import type { Handler } from "aws-lambda";

import type { SyncLambdaPayload } from "@spotify-f2p/api";
import {
  addTrackIdsToPlaylist,
  loadPlaylistTrackIds,
  loadSavedTrackIds,
  removeTrackIdsFromPlaylist,
} from "@spotify-f2p/spotify";
import { getUser, updateUser } from "@spotify-f2p/aws";

export const handle: Handler<SyncLambdaPayload, "success" | "error"> = async ({
  token,
  playlistId,
  userId,
}) => {
  const user = await getUser(userId);

  if (!token || !playlistId || !user) {
    return "error";
  }

  const playlistTracks = await loadPlaylistTrackIds(token, playlistId);

  const savedTracks = await loadSavedTrackIds(token);
  console.info("Loaded saved Tracks");

  // assume by default that all songs will be removed
  let deleteTracks: string[] = playlistTracks;
  let addTracks: string[] = [];

  // check all saved songs
  for (const track of savedTracks) {
    // add song to playlist if its missing
    if (!playlistTracks.includes(track)) {
      addTracks = [...addTracks, track];
      continue;
    }

    // remove song from the to be deleted songs
    const trackIndex = deleteTracks.indexOf(track);

    deleteTracks = [
      ...deleteTracks.slice(0, trackIndex),
      ...deleteTracks.slice(trackIndex + 1, deleteTracks.length),
    ];
  }

  await removeTrackIdsFromPlaylist(token, playlistId, deleteTracks);
  console.info("Cleared Playlist");

  await addTrackIdsToPlaylist(token, addTracks, playlistId);
  console.info("Saved tracks to playlist");

  await updateUser(
    { ...user, lockedAt: null, syncedAt: Date.now() },
    { updateKeys: ["lockedAt", "syncedAt"] },
  );

  return "success";
};
