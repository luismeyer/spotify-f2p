import { BaseResponse, PlaylistResponse, PlaylistsResponse, SnapshotResponse, Track, TracksResponse, TrackUri, UserResponse } from "./typings";
export declare const trackUri: (id: string) => string;
export declare const refreshToken: (id: string) => Promise<{
    token: string;
    id: string;
    playlistId?: string | undefined;
    url?: string | undefined;
} | undefined>;
export declare const iterateItemsRequest: <T extends BaseResponse>(limit: number, request: (offset: number) => Promise<T>) => Promise<T["items"]>;
export declare const getPlaylistTracks: (token: string, offset: number, limit: number, playlistId: string) => Promise<TracksResponse>;
export declare const removeTracksFromPlaylist: (token: string, tracks: TrackUri[], playlistId: string) => Promise<SnapshotResponse>;
export declare const getSavedTracks: (token: string, offset: number, limit: number) => Promise<TracksResponse>;
export declare const addTracksToPlaylist: (token: string, tracks: string[], playlistId: string) => Promise<SnapshotResponse>;
export declare const getPlaylists: (token: string, offset: number, limit: number) => Promise<PlaylistsResponse>;
export declare const getMe: (token: string) => Promise<UserResponse>;
export declare const simplifyTrack: (track: Track) => {
    uri: string;
};
export declare const generateAuthURL: (frontendBaseUrl: string) => string;
export declare const getToken: (code: string, frontendBaseUrl: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const getPlaylist: (token: string, playlistId: string) => Promise<PlaylistResponse>;
