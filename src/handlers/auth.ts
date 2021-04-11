import { APIGatewayEvent, ProxyResult } from "aws-lambda";
import dotenv from "dotenv";
import path from "path";
import uniqid from "uniqid";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { putUserData, redirectResponse, setupTable } from "../app/aws";
import { shortenLink } from "../app/bitly";
import { lambdaURL } from "../app/constants";
import { allPlaylists, generateAuthURL, getMe, getToken } from "../app/spotify";
import { authResponse } from "../app/template";

const handleTokenAndPlaylist = async (
  token: string,
  playlistId: string,
): Promise<ProxyResult> => {
  await setupTable();

  const userId = uniqid();
  const url = await shortenLink(`${lambdaURL}/sync?id=${userId}`);

  await putUserData(userId, token, playlistId, url);

  return redirectResponse(url);
};

const handleCode = async (code: string): Promise<ProxyResult> => {
  const { refreshToken, accessToken } = await getToken(code);
  const { id } = await getMe(accessToken);
  const rawPlaylists = await allPlaylists(accessToken);

  const playlists = rawPlaylists
    .filter((p) => p.owner.id === id)
    .map((p) => ({
      name: p.name,
      link: `${lambdaURL}/auth?token=${refreshToken}&playlistId=${p.id}&code=used`,
    }));

  return authResponse(playlists);
};

export const authHandler = async (event: APIGatewayEvent) => {
  // Redirect to Spotify API Auth
  if (!event.queryStringParameters || !event.queryStringParameters.code) {
    return redirectResponse(generateAuthURL());
  }

  const { code, playlistId, token } = event.queryStringParameters;

  if (playlistId && token) {
    // Save refresh Token and redirect to Sync Page
    return handleTokenAndPlaylist(token, playlistId);
  }

  // Gets all Playlists and render them
  return handleCode(code);
};
