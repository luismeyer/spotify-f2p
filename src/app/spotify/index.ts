import { asyncIteration, chunkArray } from "../utils";
import {
  getPlaylistTracks,
  trackUri,
  getSavedTracks,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
  getPlaylists,
  simplifyTrack,
  iterateItemsRequest,
} from "./api";

export * from "./api";

export const clearPlaylist = async (token: string) => {
  const limit = 100;

  // Fetch all songs of the Playlist
  const result = await iterateItemsRequest(limit, (offset: number) =>
    getPlaylistTracks(token, offset, limit),
  );

  // Format Fetch Resul to have the right batch size and format
  const batches = chunkArray(result, 100).map((batch) =>
    batch.map(({ track }) => simplifyTrack(track)),
  );

  // Remove all Tracks with an async for loop to prevent spotify internal Server errors
  return asyncIteration(
    batches,
    async (batch) => await removeTracksFromPlaylist(token, batch),
  );
};

export const loadSavedTracks = async (token: string) => {
  const limit = 50;

  // Fetch all songs from the libary
  const result = await iterateItemsRequest(limit, (offset: number) =>
    getSavedTracks(token, offset, limit),
  );

  // Format Fetch Resul to have the right batch size and format
  const batches = chunkArray(result, 100).map((batch) =>
    batch.map((t) => {
      return trackUri(t.track.id);
    }),
  );

  return batches;
};

export const syncSavedTracks = (token: string, songs: string[][]) => {
  // Add all songs to the Playlist with an async for loop to prevent spotify internal Server errors
  return asyncIteration(
    songs,
    async (tracks) => await addTracksToPlaylist(token, tracks),
  );
};

export const allPlaylists = async (token: string) => {
  const limit = 50;

  // Fetch all playlists
  return iterateItemsRequest(limit, (offset: number) =>
    getPlaylists(token, offset, limit),
  );
};
