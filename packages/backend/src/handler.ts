import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";

import { errorResponse } from "@spotify-f2p/aws";
import { generateAuthURL } from "@spotify-f2p/spotify";

import { urlResponse } from "./response";
import { handleCode, handleTokenAndPlaylist } from "./auth";
import { handleId } from "./sync";

const { FRONTEND_URL } = process.env;
if (!FRONTEND_URL) {
  throw new Error("Missing Env Variable: FRONTEND_URL");
}

export const frontendUrl = FRONTEND_URL;

export const handle: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
) => {
  // Redirect to Spotify API Auth
  if (!event.queryStringParameters) {
    return urlResponse(generateAuthURL(frontendUrl));
  }

  const { code, playlistId, token, id } = event.queryStringParameters;

  // Fetch songs, calc playlist diff and invoke sync lambda
  if (id) {
    return handleId(id).catch((e) => errorResponse(`Error: ${e}`));
  }

  // Fetch all Playlists and render them
  if (code && (!playlistId || !token)) {
    return handleCode(code).catch((e) => errorResponse(`Error: ${e}`));
  }

  // Save refresh Token and redirect to Sync Page
  if (token && playlistId) {
    return handleTokenAndPlaylist(token, playlistId).catch((e) =>
      errorResponse(`Error: ${e}`),
    );
  }

  return errorResponse("Missing Params");
};
