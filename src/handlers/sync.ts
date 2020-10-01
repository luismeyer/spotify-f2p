import dotenv from "dotenv";
import path from "path";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { refreshToken } from "../app/spotify";
import { clearPlaylist, loadSavedTracks, syncSavedTracks } from "../app";

export const syncHandler = async () => {
  const token = await refreshToken();
  if (!token) return false;

  await clearPlaylist(token);
  console.info("Cleared Playlist");

  const savedTracksBatches = await loadSavedTracks(token);
  console.info("Loaded saved Tracks");

  await syncSavedTracks(token, savedTracksBatches);
  console.info("Saved tracks to playlist");

  return true;
};
