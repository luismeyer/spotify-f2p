import { SyncResponse } from "@spotify-f2p/api";
import { successResponse } from "@spotify-f2p/aws";

export const syncResponse = (count: number) =>
  successResponse<SyncResponse>({
    success: true,
    count,
  });
