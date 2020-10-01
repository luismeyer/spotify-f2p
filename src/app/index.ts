import {
  getPlaylistTracks,
  trackUri,
  getSavedTracks,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
  getPlaylists,
} from "./spotify";

export const clearPlaylist = async (token: string) => {
  const limit = 100;
  let offset = 0;

  const batches = [];
  let { items } = await getPlaylistTracks(token, offset, limit);

  while (items.length > 0) {
    batches.push(
      items.map(({ track }) => ({
        uri: trackUri(track.id),
      }))
    );

    offset += limit;
    items = (await getPlaylistTracks(token, offset, limit)).items;
  }

  return Promise.all(
    batches.map((tracks) => removeTracksFromPlaylist(token, tracks))
  );
};

export const loadSavedTracks = async (token: string) => {
  let offset = 0;
  let { items } = await getSavedTracks(token, 0);

  let index = 0;
  let songs = [] as string[][];

  while (items.length > 0) {
    const songUris = items.map(({ track }) => trackUri(track.id));
    songs[index] = songs[index] ? [...songs[index], ...songUris] : songUris;
    index = songs[index].length === 100 ? index + 1 : index;

    offset += 20;
    items = (await getSavedTracks(token, offset)).items;
  }

  return songs;
};

export const syncSavedTracks = (token: string, songs: string[][]) =>
  Promise.all(
    songs
      .filter((tracks) => tracks.length > 0)
      .map((tracks) => addTracksToPlaylist(token, tracks))
  );

export const searchPlaylists = async (token: string, name: string) => {
  const limit = 50;
  let offset = 0;

  let { items } = await getPlaylists(token, offset, limit);

  while (items.length > 0) {
    let result = items.find((playlist) => playlist.name === name);
    if (result) return result;

    offset += limit;
    items = (await getPlaylists(token, offset, limit)).items;
  }

  return;
};
