export type Error = {
    status: number;
    message: string;
};
export type TokenResponse = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token?: string;
};
export type UserResponse = {
    id: string;
    display_name: string;
    href: string;
    error?: Error;
};
export type SnapshotResponse = {
    snapshot_id: string;
    error?: Error;
};
export type BaseResponse<T = {}> = {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    error?: Error;
    items: T[];
};
export type PlaylistsResponse = BaseResponse<Playlist>;
export type Playlist = {
    collaborative: boolean;
    description: string;
    href: string;
    id: string;
    name: string;
    owner: UserResponse;
};
export type PlaylistResponse = Playlist & {
    tracks: {
        total: number;
    };
    error?: Error;
};
export type TracksResponse = BaseResponse<TrackResponse>;
export type TrackResponse = {
    added_at: string;
    is_local: boolean;
    track: Track;
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
