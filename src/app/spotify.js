const fetch = require("node-fetch");

const { putRefreshToken, getRefreshToken } = require("./aws");

const { CLIENT_ID, CLIENT_SECRET, PLAYLIST_ID } = process.env;

if (!CLIENT_ID) throw Error("Missing Env: 'CLIENT_ID'");
if (!CLIENT_SECRET) throw Error("Missing Env: 'CLIENT_SECRET'");
if (!PLAYLIST_ID) throw Error("Missing Env: 'PLAYLIST_ID'");

const SPOTIFY_BASIC_TOKEN = Buffer.from(
  `${CLIENT_ID}:${CLIENT_SECRET}`
).toString("base64");

module.exports.spotifyFetch = spotifyFetch = (token, endpoint, options) =>
  fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
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
      console.info("Token expires in ", body.expires_in);

      if (body.refresh_token) {
        await putRefreshToken(body.refresh_token);
      }

      return body.access_token;
    });
};

module.exports.getPlaylistTracks = (token, offset, limit) =>
  spotifyFetch(
    token,
    `/playlists/${PLAYLIST_ID}/tracks?offset=${offset}&limit=${limit}`,
    { method: "GET" }
  ).catch((err) => {
    throw Error("playlist tracks", err);
  });

module.exports.removeTracksFromPlaylist = (token, tracks) =>
  spotifyFetch(token, `/playlists/${PLAYLIST_ID}/tracks`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ tracks }),
  }).catch((err) => {
    throw Error("remove tracks", err);
  });

module.exports.getSavedTracks = (token, offset) =>
  spotifyFetch(token, `/me/tracks?offset=${offset}`).catch((err) => {
    throw Error("saved tracks", err);
  });

module.exports.addTracksToPlaylist = (token, tracks) =>
  spotifyFetch(token, `/playlists/${PLAYLIST_ID}/tracks`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ uris: tracks }),
  }).catch((err) => {
    throw Error("add tracks", err);
  });

module.exports.getPlaylists = (token, offset, limit) =>
  spotifyFetch(token, `/me/playlists?offset=${offset}&limit=${limit}`).catch(
    (err) => {
      throw Error("get playlist", err);
    }
  );
