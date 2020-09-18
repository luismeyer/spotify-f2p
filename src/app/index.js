const {
  getPlaylistTracks,
  trackUri,
  getSavedTracks,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
} = require("./spotify");

module.exports.clearPlaylist = async () => {
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

module.exports.loadSavedTracks = async () => {
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

module.exports.syncSavedTracks = (songs) =>
  Promise.all(
    songs.filter((tracks) => tracks.length > 0).map(addTracksToPlaylist)
  );
