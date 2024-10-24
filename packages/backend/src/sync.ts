import type { SyncLambdaPayload } from "@spotify-f2p/api";
import {
  type UserData,
  errorResponse,
  invokeAsyncLambda,
} from "@spotify-f2p/aws";
import {
  loadPlaylist,
  loadSavedTotal,
  refreshToken,
} from "@spotify-f2p/spotify";

import { syncResponse } from "./response";

const { SYNC_LAMBDA } = process.env;
if (!SYNC_LAMBDA) {
  throw new Error("Missing Env: SYNC_LAMBDA");
}

export const sync = async (user: UserData) => {
  const dbResponse = await refreshToken(user);
  if (!dbResponse) {
    return errorResponse("DB Error");
  }

  const { token, playlistId, url } = dbResponse;
  if (!playlistId) {
    return errorResponse("Missing playlist id");
  }

  await invokeAsyncLambda<SyncLambdaPayload>(SYNC_LAMBDA, {
    playlistId,
    token,
    userId: user.id,
  });

  const { name, total } = await loadPlaylist(token, playlistId);
  const savedTotal = await loadSavedTotal(token);

  const count = savedTotal - total;

  return syncResponse({
    success: true,
    count,
    bitlyUrl: url ?? "hier fehlt was",
    playlistName: name,
  });
};
