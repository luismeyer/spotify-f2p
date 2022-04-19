import { APIGatewayEvent, ProxyResult } from "aws-lambda";
import uniqid from "uniqid";

import { putUserData, successResponse } from "@spotify-f2p/aws";
import {
  generateAuthURL,
  getMe,
  getToken,
  loadAllPlaylists,
} from "@spotify-f2p/spotify";

import { shortenLink } from "./bitly";

// TODO
const frontendUrl = "lol";

const handleTokenAndPlaylist = async (
  token: string,
  playlistId: string,
): Promise<ProxyResult> => {
  const userId = uniqid();
  const url = await shortenLink(`${frontendUrl}/sync?id=${userId}`);

  await putUserData(userId, token, playlistId, url);

  return successResponse({ url });
};

const handleCode = async (code: string): Promise<ProxyResult> => {
  const { refreshToken, accessToken } = await getToken(code);
  const { id } = await getMe(accessToken);
  const rawPlaylists = await loadAllPlaylists(accessToken);

  const playlists = rawPlaylists
    .filter((p) => p.owner.id === id)
    .map((p) => ({
      name: p.name,
      link: `${frontendUrl}/auth?token=${refreshToken}&playlistId=${p.id}&code=used`,
    }));

  return successResponse({ playlists });
};

export const authHandler = async (event: APIGatewayEvent) => {
  // Redirect to Spotify API Auth
  if (!event.queryStringParameters || !event.queryStringParameters.code) {
    return successResponse({ url: generateAuthURL() });
  }

  const { code, playlistId, token } = event.queryStringParameters;

  if (playlistId && token) {
    // Save refresh Token and redirect to Sync Page
    return handleTokenAndPlaylist(token, playlistId);
  }

  // Gets all Playlists and render them
  return handleCode(code);
};
