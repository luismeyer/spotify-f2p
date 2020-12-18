import fetch, { RequestInit } from "node-fetch";

import { putRefreshToken, getRefreshToken } from "./aws";
import {
  PlaylistsResponse,
  SnapshotResponse,
  TokenResponse,
  TrackUri,
  TracksResponse,
  Track,
  BaseResponse,
  Error,
} from "./typings";

const { CLIENT_ID, CLIENT_SECRET, PLAYLIST_ID } = process.env;

if (!CLIENT_ID) {
  throw Error("Missing Env: 'CLIENT_ID'");
}
if (!CLIENT_SECRET) {
  throw Error("Missing Env: 'CLIENT_SECRET'");
}
if (!PLAYLIST_ID) {
  throw Error("Missing Env: 'PLAYLIST_ID'");
}

const SPOTIFY_BASIC_TOKEN = Buffer.from(
  `${CLIENT_ID}:${CLIENT_SECRET}`,
).toString("base64");

export const spotifyFetch = <T extends { error?: Error }>(
  token: string,
  endpoint: string,
  options?: Partial<RequestInit>,
) =>
  fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json() as Promise<T>)
    .then((res) => {
      if (res.error) {
        throw Error(`Spotify Fetch Error: ${res.error.message}`);
      }

      return res;
    })
    .catch((err) => {
      throw Error(`Spotify Fetch Error: ${err}`);
    });

export const trackUri = (id: string) => `spotify:track:${id}`;

export const refreshToken = async (): Promise<string> => {
  const secret = await getRefreshToken();

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${SPOTIFY_BASIC_TOKEN}`,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${secret}`,
  })
    .then((res) => res.json())
    .then(async (body: TokenResponse) => {
      if (body.refresh_token) {
        await putRefreshToken(body.refresh_token);
      }

      return body.access_token;
    });
};

export const iterateItemsRequest = async <T extends BaseResponse>(
  limit: number,
  request: (offset: number) => Promise<T>,
) => {
  let offset = 0;
  const result = [] as T["items"];
  let { items } = await request(offset);

  while (items.length > 0) {
    result.push(...items);
    offset += limit;
    items = await request(offset).then(({ items: i }) => i);
  }

  return result;
};

export const getPlaylistTracks = async (
  token: string,
  offset: number,
  limit: number,
) =>
  spotifyFetch<TracksResponse>(
    token,
    `/playlists/${PLAYLIST_ID}/tracks?offset=${offset}&limit=${limit}`,
    { method: "GET" },
  ).catch((err) => {
    throw Error(`playlist tracks ${err}`);
  });

export const removeTracksFromPlaylist = (token: string, tracks: TrackUri[]) =>
  spotifyFetch<SnapshotResponse>(token, `/playlists/${PLAYLIST_ID}/tracks`, {
    method: "DELETE",
    body: JSON.stringify({ tracks }),
  }).catch((err) => {
    throw Error(`remove tracks ${err}`);
  });

export const getSavedTracks = async (
  token: string,
  offset: number,
  limit: number,
) =>
  spotifyFetch<TracksResponse>(
    token,
    `/me/tracks?offset=${offset}&limit=${limit}`,
  ).catch((err) => {
    throw Error(`saved tracks ${err}`);
  });

export const addTracksToPlaylist = async (token: string, tracks: string[]) =>
  spotifyFetch<SnapshotResponse>(token, `/playlists/${PLAYLIST_ID}/tracks`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ uris: tracks }),
  }).catch((err) => {
    throw Error(`add tracks ${err}`);
  });

export const getPlaylists = (token: string, offset: number, limit: number) =>
  spotifyFetch<PlaylistsResponse>(
    token,
    `/me/playlists?offset=${offset}&limit=${limit}`,
  ).catch((err) => {
    throw Error(`get playlist ${err}`);
  });

export const simplifyTrack = (track: Track) => ({
  uri: trackUri(track.id),
});
