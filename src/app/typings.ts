export type TokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

export type SnapshotResponse = {
  snapshot_id: string;
};

export type BaseResponse = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};

export type PlaylistsResponse = BaseResponse & {
  items: Playlist[];
};

export type Playlist = {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  name: string;
};

export type TracksResponse = BaseResponse & {
  items: {
    added_at: string;
    is_local: boolean;
    track: Track;
  }[];
};

export type TrackUri = {
  uri: string;
};

export type Track = {
  artists: Artist;
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  id: string;
  href: string;
};

export type Artist = {
  external_urls: ExternalURL;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type ExternalURL = {
  ["key"]: ["value"];
};
