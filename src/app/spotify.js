const fetch = require("node-fetch");

const { putRefreshToken, getRefreshToken } = require("./aws");

const { CLIENT_ID, CLIENT_SECRET, PLAYLIST_ID } = process.env;

if (!CLIENT_ID) throw Error("Missing Env: 'CLIENT_ID'");
if (!CLIENT_SECRET) throw Error("Missing Env: 'CLIENT_SECRET'");
if (!PLAYLIST_ID) throw Error("Missing Env: 'PLAYLIST_ID'");

const SPOTIFY_BASIC_TOKEN = Buffer.from(
  `${CLIENT_ID}:${CLIENT_SECRET}`
).toString("base64");

let TOKEN;

module.exports.spotifyFetch = spotifyFetch = (endpoint, options) =>
  fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: "Bearer " + TOKEN,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      throw Error("Spotify Fetch Error: ", err);
    });

module.exports.trackUri = (id) => `spotify:track:${id}`;

module.exports.refreshToken = async () => {
  const { SecretString } = await getRefreshToken();

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${SPOTIFY_BASIC_TOKEN}`,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${SecretString}`,
  })
    .then((res) => res.json())
    .then(async (body) => {
      TOKEN = body.access_token;
      console.info("Token expires in ", body.expires_in);

      if (body.refresh_token) {
        return putRefreshToken(body.refresh_token);
      }
    });
};

module.exports.getPlaylistTracks = (offset, limit) =>
  spotifyFetch(
    `/playlists/${PLAYLIST_ID}/tracks?offset=${offset}&limit=${limit}`,
    { method: "GET" }
  ).catch((err) => {
    throw Error("playlist tracks", err);
  });

module.exports.removeTracksFromPlaylist = (tracks) =>
  spotifyFetch(`/playlists/${PLAYLIST_ID}/tracks`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ tracks }),
  }).catch((err) => {
    throw Error("remove tracks", err);
  });

module.exports.getSavedTracks = (offset) =>
  spotifyFetch(`/me/tracks?offset=${offset}`).catch((err) => {
    throw Error("saved tracks", err);
  });

module.exports.addTracksToPlaylist = (tracks) =>
  spotifyFetch(`/playlists/${PLAYLIST_ID}/tracks`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ uris: tracks }),
  }).catch((err) => {
    throw Error("remove tracks", err);
  });
