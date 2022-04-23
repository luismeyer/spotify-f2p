import {
  APIGatewayEvent,
  APIGatewayProxyHandler,
  ProxyResult,
} from "aws-lambda";
import uniqid from "uniqid";

import { saveUser, errorResponse } from "@spotify-f2p/aws";
import {
  generateAuthURL,
  getMe,
  getToken,
  loadAllPlaylists,
} from "@spotify-f2p/spotify";

import { shortenUrl } from "./bitly";
import { urlResponse, playlistsResponse } from "./response";

const { FRONTEND_URL } = process.env;
if (!FRONTEND_URL) {
  throw new Error("Missing Env Variable: FRONTEND_URL");
}

const frontendUrl = FRONTEND_URL;

// Creates Bitly url and ends the auth process
const handleTokenAndPlaylist = async (
  token: string,
  playlistId: string,
): Promise<ProxyResult> => {
  const userId = uniqid();
  const url = await shortenUrl(`/sync?id=${userId}`);

  await saveUser({ id: userId, token, playlistId, url });

  return urlResponse(url);
};

// Fetch all playlists so the user can select one
const handleCode = async (code: string): Promise<ProxyResult> => {
  const { refreshToken, accessToken } = await getToken(code, frontendUrl);

  const { id } = await getMe(accessToken);
  const rawPlaylists = await loadAllPlaylists(accessToken);

  const playlists = rawPlaylists
    .filter((p) => p.owner.id === id)
    .map((p) => ({
      name: p.name,
      url: `/auth?token=${refreshToken}&playlistId=${p.id}&code=used`,
    }));

  return playlistsResponse(playlists);
};

export const handle: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
) => {
  // Redirect to Spotify API Auth
  if (!event.queryStringParameters || !event.queryStringParameters.code) {
    return urlResponse(generateAuthURL(frontendUrl));
  }

  const { code, playlistId, token } = event.queryStringParameters;

  if (!playlistId || !token) {
    // Get all Playlists and render them
    return handleCode(code).catch((e) => errorResponse(`Error: ${e}`));
  }

  // Save refresh Token and redirect to Sync Page
  return handleTokenAndPlaylist(token, playlistId).catch((e) =>
    errorResponse(`Error: ${e}`),
  );
};
