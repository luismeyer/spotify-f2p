import { SyncLambdaPayload } from "@spotify-f2p/api";
import { errorResponse, invokeSyncLambda } from "@spotify-f2p/aws";
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

export const handleId = async (id: string) => {
  const dbResponse = await refreshToken(id);
  if (!dbResponse) {
    return errorResponse("DB Error");
  }

  const { token, playlistId, url } = dbResponse;
  if (!playlistId) {
    return errorResponse("Missing playlist id");
  }

  await invokeSyncLambda<SyncLambdaPayload>(SYNC_LAMBDA, {
    playlistId,
    token,
  });

  const { name, total } = await loadPlaylist(token, playlistId);
  const savedTotal = await loadSavedTotal(token);

  const count = savedTotal - total;

  return syncResponse(count, url ?? "hier fehlt was", name);
};
