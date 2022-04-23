export type Response<T> =
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
}>;
