import { asyncIteration, chunkArray } from "./utils";
import {
  addTracksToPlaylist,
  getPlaylists,
  getPlaylistTracks,
  getSavedTracks,
  iterateItemsRequest,
  removeTracksFromPlaylist,
  trackUri,
} from "./api";

export * from "./api";

export const loadPlaylistTrackIds = async (
  token: string,
  playlistId: string,
) => {
  const limit = 100;

  // Fetch all songs of the Playlist
  const response = await iterateItemsRequest(limit, (offset: number) =>
    getPlaylistTracks(token, offset, limit, playlistId),
  );

  return response.map(({ track }) => track.id);
};

export const loadSavedTrackIds = async (token: string) => {
  const limit = 50;

  // Fetch all songs from the libary
  const response = await iterateItemsRequest(limit, (offset: number) =>
    getSavedTracks(token, offset, limit),
  );

  return response.map(({ track }) => track.id);
};

export const removeTrackIdsFromPlaylist = async (
  token: string,
  playlistId: string,
  tracks: string[],
) => {
  // Format Fetch Resul to have the right batch size and format
  const batches = chunkArray(
    tracks.map((id) => ({ uri: trackUri(id) })),
    100,
  );

  // Remove all Tracks with an async for loop to prevent spotify internal Server errors
  return asyncIteration(
    batches,
    async (batch) => await removeTracksFromPlaylist(token, batch, playlistId),
  );
};

export const addTrackIdsToPlaylist = (
  token: string,
  tracks: string[],
  playlistId: string,
) => {
  const batches = chunkArray(tracks.map(trackUri), 100);

  // Add all songs to the Playlist with an async for loop to prevent spotify internal Server errors
  return asyncIteration(
    batches,
    async (batch) => await addTracksToPlaylist(token, batch, playlistId),
  );
};

export const loadAllPlaylists = async (token: string) => {
  const limit = 50;

  // Fetch all playlists
  return iterateItemsRequest(limit, (offset: number) =>
    getPlaylists(token, offset, limit),
  );
};
