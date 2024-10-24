export type Response<T extends { success: true }> =
  | T
  | {
      success: false;
      message: string;
    };

export type UrlResponse = Response<{
  success: true;
  url: string;
}>;

export type SimplePlaylist = {
  name: string;
  url: string;
};

export type PlaylistsResponse = Response<{
  success: true;
  playlists: SimplePlaylist[];
}>;

export type SyncResponse = Response<{
  success: true;
  count: number;
  bitlyUrl: string;
  playlistName: string;
}>;

export type IdResponse = Response<{ success: true; id: string }>;

export type SyncLambdaPayload = {
  token: string;
  playlistId: string;
  userId: string;
};

export type InfoResponse = Response<{
  success: true;
  bitlyUrl: string;
  syncedAt: number;
  blocked: boolean;
}>;
