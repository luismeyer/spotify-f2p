import { UrlResponse, PlaylistsResponse } from "@spotify-f2p/api";
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
