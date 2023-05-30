import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

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

const baseBath = "backend";

const route = (path: string, run: () => Promise<APIGatewayProxyResult>) => ({
  path: `${baseBath}/${path}`,
  run,
});

export const handle: APIGatewayProxyHandler = async (event) => {
  const { code, playlistId, token, id } = event.queryStringParameters ?? {};

  const routes = [
    // Redirect to Spotify API Auth
    route("auth", async () => urlResponse(generateAuthURL(frontendUrl))),

    // Fetch songs, calc playlist diff and invoke sync lambda
    route("sync", async () => {
      if (!id) {
        throw new Error("Missing 'id' param");
      }

      return handleId(id).catch((e) => errorResponse(`Error: ${e}`));
    }),

    // Fetch all Playlists
    route("playlists", async () => {
      if (!code) {
        throw new Error("Missing 'code' param");
      }

      return handleCode(code).catch((e) => errorResponse(`Error: ${e}`));
    }),

    // Save refresh Token and redirect to Sync Page
    route("register", async () => {
      if (!token || !playlistId) {
        throw new Error("missing 'token' or 'playlistId' param");
      }

      return handleTokenAndPlaylist(token, playlistId);
    }),
  ];

  const handler = routes.find(({ path }) => event.path.includes(path));

  if (!handler) {
    return errorResponse("Missing Route");
  }

  try {
    return handler.run();
  } catch (e) {
    if (e instanceof Error) {
      return errorResponse(e.message);
    }

    return errorResponse("Unknown Error " + e);
  }
};
