import { SyncResponse } from "@spotify-f2p/api";
import { successResponse } from "@spotify-f2p/aws";

export const syncResponse = (count: number, url: string) =>
  successResponse<SyncResponse>({
    success: true,
    count,
    bitlyUrl: url,
  });
