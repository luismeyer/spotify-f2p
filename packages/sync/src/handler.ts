import { Handler } from "aws-lambda";

import { SyncLambdaPayload } from "@spotify-f2p/api";
import {
  addTrackIdsToPlaylist,
  removeTrackIdsFromPlaylist,
} from "@spotify-f2p/spotify";

export const handle: Handler<SyncLambdaPayload, "success" | "error"> = async ({
  token,
  playlistId,
  deleteTracks,
  addTracks,
}) => {
  if (!token || !playlistId || !deleteTracks || !addTracks) {
    return "error";
  }

  await removeTrackIdsFromPlaylist(token, playlistId, deleteTracks);
  console.info("Cleared Playlist");

  await addTrackIdsToPlaylist(token, addTracks, playlistId);
  console.info("Saved tracks to playlist");

  return "success";
};
