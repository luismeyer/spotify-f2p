import fetch, { RequestInit } from "node-fetch";
import querystring from "querystring";
import { getUserData, putUserData } from "../aws";
import { lambdaURL } from "../constants";
import {
  BaseResponse,
  Error,
  PlaylistsResponse,
  SnapshotResponse,
  TokenResponse,
  Track,
  TracksResponse,
  TrackUri,
  UserResponse,
} from "../typings";
import { generateRandomString } from "../utils";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

if (!CLIENT_ID) {
  throw Error("Missing Env: 'CLIENT_ID'");
}
if (!CLIENT_SECRET) {
  throw Error("Missing Env: 'CLIENT_SECRET'");
}

const SPOTIFY_BASIC_HEADER =
  "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

const redirect_uri = lambdaURL + "/auth";

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

export const refreshToken = async (id: string) => {
  const tokenResponse = await getUserData(id);
  if (!tokenResponse) {
    return Promise.resolve(undefined);
  }

  const { token } = tokenResponse;

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: SPOTIFY_BASIC_HEADER,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${token}`,
  })
    .then((res) => res.json())
    .then(async (body: TokenResponse) => {
      if (body.refresh_token) {
        await putUserData(id, body.refresh_token);
      }

      return {
        ...tokenResponse,
        token: body.access_token,
      };
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
  playlistId: string,
) =>
  spotifyFetch<TracksResponse>(
    token,
    `/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
    { method: "GET" },
  ).catch((err) => {
    throw Error(`playlist tracks ${err}`);
  });

export const removeTracksFromPlaylist = (
  token: string,
  tracks: TrackUri[],
  playlistId: string,
) =>
  spotifyFetch<SnapshotResponse>(token, `/playlists/${playlistId}/tracks`, {
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

export const addTracksToPlaylist = async (
  token: string,
  tracks: string[],
  playlistId: string,
) =>
  spotifyFetch<SnapshotResponse>(token, `/playlists/${playlistId}/tracks`, {
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

export const getMe = (token: string) =>
  spotifyFetch<UserResponse>(token, `/me`).catch((err) => {
    throw Error(`get me ${err}`);
  });

export const simplifyTrack = (track: Track) => ({
  uri: trackUri(track.id),
});

export const generateAuthURL = () => {
  const scope =
    "playlist-modify-public playlist-read-private user-library-read playlist-modify-private";

  const state = generateRandomString(16);

  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri,
      state,
      show_dialog: true,
    })
  );
};

export const getToken = (code: string) =>
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: SPOTIFY_BASIC_HEADER,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
  })
    .then((res) => res.json())
    .then(async (body) => ({
      accessToken: body.access_token as string,
      refreshToken: body.refresh_token as string,
    }));
