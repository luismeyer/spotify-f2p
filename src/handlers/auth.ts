import { ProxyResult } from "aws-lambda";
import uniqid from "uniqid";
import fs from "fs";
import { APIGatewayEvent } from "aws-lambda";
import path from "path";
import dotenv from "dotenv";
import Handlebars from "handlebars";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { generateAuthURL, getMe, getToken, allPlaylists } from "../app/spotify";
import {
  redirectResponse,
  setupTable,
  putUserData,
  successResponse,
} from "../app/aws";
import { lambdaURL } from "../app/constants";
import { shortenLink } from "../app/bitly";

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

  const source = fs
    .readFileSync(path.resolve(__dirname, "../../templates/auth.html"))
    .toString();

  const template = Handlebars.compile(source);

  return successResponse(template({ playlists }));
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
