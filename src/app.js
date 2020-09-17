require("dotenv").config();

const {
  getPlaylistTracks,
  trackUri,
  getSavedTracks,
  addTracksToPlaylist,
  refreshToken,
  removeTracksFromPlaylist,
} = require("./spotify");

const clearPlaylist = async () => {
  const batches = [];
  const limit = 100;
  let offset = 0;
  let { items } = await getPlaylistTracks(offset, limit);

  while (items.length > 0) {
    items = (await getPlaylistTracks(offset, limit)).items;
    offset += limit;

    batches.push(
      items.map(({ track }) => ({
        uri: trackUri(track.id),
      }))
    );
  }

  return Promise.all(batches.map(removeTracksFromPlaylist));
};

const loadSavedTracks = async () => {
  let offset = 0;
  let { items } = await getSavedTracks(0);

  let index = 0;
  let songs = [];

  while (items.length > 0) {
    items = (await getSavedTracks(offset)).items;
    offset += 20;

    const songUris = items.map(({ track }) => trackUri(track.id));
    songs[index] = songs[index] ? [...songs[index], ...songUris] : songUris;
    index = songs[index].length === 100 ? index + 1 : index;
  }

  return songs;
};

const syncSavedTracks = (songs) =>
  Promise.all(
    songs.filter((tracks) => tracks.length > 0).map(addTracksToPlaylist)
  );

module.exports.handler = async () => {
  await refreshToken();

  await clearPlaylist();
  console.info("Cleared Playlist");

  const savedTracksBatches = await loadSavedTracks();
  console.info("Loaded saved Tracks");

  await syncSavedTracks(savedTracksBatches);
  console.info("Saved tracks to playlist");

  return true;
};
