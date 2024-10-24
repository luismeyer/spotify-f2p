import type {
  UrlResponse,
  PlaylistsResponse,
  IdResponse,
  SyncResponse,
  InfoResponse,
} from "@spotify-f2p/api";
import { successResponse } from "@spotify-f2p/aws";

export const urlResponse = (url: string) =>
  successResponse<UrlResponse>({
    success: true,
    url,
  });

type SimplePlaylist = {
  name: string;
  url: string;
};

export const playlistsResponse = (playlists: SimplePlaylist[]) =>
  successResponse<PlaylistsResponse>({
    success: true,
    playlists,
  });

export const idResponse = (id: string) =>
  successResponse<IdResponse>({ success: true, id });

export const syncResponse = (options: SyncResponse) => successResponse(options);

export const infoResponse = (options: InfoResponse) => successResponse(options);
