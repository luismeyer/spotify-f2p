"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylist = exports.getToken = exports.generateAuthURL = exports.simplifyTrack = exports.getMe = exports.getPlaylists = exports.addTracksToPlaylist = exports.getSavedTracks = exports.removeTracksFromPlaylist = exports.getPlaylistTracks = exports.iterateItemsRequest = exports.refreshToken = exports.trackUri = void 0;
const axios_1 = __importDefault(require("axios"));
const aws_1 = require("@spotify-f2p/aws");
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
if (!SPOTIFY_CLIENT_ID) {
    throw Error("Missing Env: 'SPOTIFY_CLIENT_ID'");
}
if (!SPOTIFY_CLIENT_SECRET) {
    throw Error("Missing Env: 'SPOTIFY_CLIENT_SECRET'");
}
const SPOTIFY_BASIC_HEADER = `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`;
const spotifyFetch = async (token, endpoint, options) => {
    return (0, axios_1.default)(`https://api.spotify.com/v1${endpoint}`, {
        ...options,
        headers: {
            Authorization: "Bearer " + token,
        },
    })
        .then((res) => res.data)
        .then((res) => {
        if (res.error) {
            throw Error(`Spotify Fetch Error: ${res.error.message}`);
        }
        return res;
    })
        .catch((err) => {
        throw Error(`Spotify Fetch Error: ${err}`);
    });
};
const trackUri = (id) => `spotify:track:${id}`;
exports.trackUri = trackUri;
const refreshToken = async (id) => {
    const user = await (0, aws_1.getUser)(id);
    if (!user) {
        return Promise.resolve(undefined);
    }
    const { token } = user;
    return (0, axios_1.default)("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: SPOTIFY_BASIC_HEADER,
            "Content-type": "application/x-www-form-urlencoded",
        },
        data: `grant_type=refresh_token&refresh_token=${token}`,
    }).then(async (body) => {
        if (body.data.refresh_token) {
            await (0, aws_1.updateUser)({ ...user, token: body.data.refresh_token }, { updateKeys: ["token"] });
        }
        return {
            ...user,
            token: body.data.access_token,
        };
    });
};
exports.refreshToken = refreshToken;
const iterateItemsRequest = async (limit, request) => {
    let offset = 0;
    let result = [];
    let { items } = await request(offset);
    while (items.length > 0) {
        result = [...result, ...items];
        offset = offset + limit;
        items = await request(offset).then(({ items: i }) => i);
    }
    return result;
};
exports.iterateItemsRequest = iterateItemsRequest;
const getPlaylistTracks = async (token, offset, limit, playlistId) => spotifyFetch(token, `/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`, { method: "GET" }).catch((err) => {
    throw Error(`playlist tracks ${err}`);
});
exports.getPlaylistTracks = getPlaylistTracks;
const removeTracksFromPlaylist = (token, tracks, playlistId) => spotifyFetch(token, `/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    data: JSON.stringify({ tracks }),
}).catch((err) => {
    throw Error(`remove tracks ${err}`);
});
exports.removeTracksFromPlaylist = removeTracksFromPlaylist;
const getSavedTracks = async (token, offset, limit) => spotifyFetch(token, `/me/tracks?offset=${offset}&limit=${limit}`).catch((err) => {
    throw Error(`saved tracks ${err}`);
});
exports.getSavedTracks = getSavedTracks;
const addTracksToPlaylist = async (token, tracks, playlistId) => spotifyFetch(token, `/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    data: JSON.stringify({ uris: tracks }),
}).catch((err) => {
    throw Error(`add tracks ${err}`);
});
exports.addTracksToPlaylist = addTracksToPlaylist;
const getPlaylists = (token, offset, limit) => spotifyFetch(token, `/me/playlists?offset=${offset}&limit=${limit}`).catch((err) => {
    throw Error(`get playlists ${err}`);
});
exports.getPlaylists = getPlaylists;
const getMe = (token) => spotifyFetch(token, `/me`).catch((err) => {
    throw Error(`get me ${err}`);
});
exports.getMe = getMe;
const simplifyTrack = (track) => ({
    uri: (0, exports.trackUri)(track.id),
});
exports.simplifyTrack = simplifyTrack;
const generateRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const generateAuthURL = (frontendBaseUrl) => {
    const redirect_uri = `${frontendBaseUrl}/redirect`;
    const scope = "playlist-modify-public playlist-read-private user-library-read playlist-modify-private";
    const state = generateRandomString(16);
    return ("https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: SPOTIFY_CLIENT_ID,
            scope,
            redirect_uri,
            state,
            show_dialog: "true",
        }).toString());
};
exports.generateAuthURL = generateAuthURL;
const getToken = async (code, frontendBaseUrl) => {
    const redirect_uri = `${frontendBaseUrl}/redirect`;
    return (0, axios_1.default)("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: SPOTIFY_BASIC_HEADER,
            "Content-type": "application/x-www-form-urlencoded",
        },
        data: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
    }).then(async (body) => ({
        accessToken: body.data.access_token,
        refreshToken: body.data.refresh_token,
    }));
};
exports.getToken = getToken;
const getPlaylist = async (token, playlistId) => spotifyFetch(token, `/playlists/${playlistId}`).catch((err) => {
    throw Error(`get playlist error ${err}`);
});
exports.getPlaylist = getPlaylist;
//# sourceMappingURL=api.js.map