export * from "./api";
export declare const loadPlaylistTrackIds: (token: string, playlistId: string) => Promise<string[]>;
export declare const loadSavedTrackIds: (token: string) => Promise<string[]>;
export declare const removeTrackIdsFromPlaylist: (token: string, playlistId: string, tracks: string[]) => Promise<void>;
export declare const addTrackIdsToPlaylist: (token: string, tracks: string[], playlistId: string) => Promise<void>;
export declare const loadAllPlaylists: (token: string) => Promise<import("./typings").Playlist[]>;
export declare const loadPlaylist: (token: string, playlistId: string) => Promise<{
    total: number;
    name: string;
}>;
export declare const loadSavedTotal: (token: string) => Promise<number>;
