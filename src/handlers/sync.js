require("dotenv").config();
const { refreshToken } = require("../app/spotify");
const { clearPlaylist, loadSavedTracks, syncSavedTracks } = require("../app");

exports.syncHandler = async () => {
  await refreshToken();

  await clearPlaylist();
  console.info("Cleared Playlist");

  const savedTracksBatches = await loadSavedTracks();
  console.info("Loaded saved Tracks");

  await syncSavedTracks(savedTracksBatches);
  console.info("Saved tracks to playlist");

  return true;
};
