"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSavedTotal = exports.loadPlaylist = exports.loadAllPlaylists = exports.addTrackIdsToPlaylist = exports.removeTrackIdsFromPlaylist = exports.loadSavedTrackIds = exports.loadPlaylistTrackIds = void 0;
const utils_1 = require("./utils");
const api_1 = require("./api");
__exportStar(require("./api"), exports);
const loadPlaylistTrackIds = async (token, playlistId) => {
    const limit = 100;
    const response = await (0, api_1.iterateItemsRequest)(limit, (offset) => (0, api_1.getPlaylistTracks)(token, offset, limit, playlistId));
    return response.map(({ track }) => track.id);
};
exports.loadPlaylistTrackIds = loadPlaylistTrackIds;
const loadSavedTrackIds = async (token) => {
    const limit = 50;
    const response = await (0, api_1.iterateItemsRequest)(limit, (offset) => (0, api_1.getSavedTracks)(token, offset, limit));
    return response.map(({ track }) => track.id);
};
exports.loadSavedTrackIds = loadSavedTrackIds;
const removeTrackIdsFromPlaylist = async (token, playlistId, tracks) => {
    const batches = (0, utils_1.chunkArray)(tracks.map((id) => ({ uri: (0, api_1.trackUri)(id) })), 100);
    return (0, utils_1.asyncIteration)(batches, async (batch) => await (0, api_1.removeTracksFromPlaylist)(token, batch, playlistId));
};
exports.removeTrackIdsFromPlaylist = removeTrackIdsFromPlaylist;
const addTrackIdsToPlaylist = (token, tracks, playlistId) => {
    const batches = (0, utils_1.chunkArray)(tracks.map(api_1.trackUri), 100);
    return (0, utils_1.asyncIteration)(batches, async (batch) => await (0, api_1.addTracksToPlaylist)(token, batch, playlistId));
};
exports.addTrackIdsToPlaylist = addTrackIdsToPlaylist;
const loadAllPlaylists = async (token) => {
    const limit = 50;
    return (0, api_1.iterateItemsRequest)(limit, (offset) => (0, api_1.getPlaylists)(token, offset, limit));
};
exports.loadAllPlaylists = loadAllPlaylists;
const loadPlaylist = async (token, playlistId) => {
    const { name, tracks: { total }, } = await (0, api_1.getPlaylist)(token, playlistId);
    return { total, name };
};
exports.loadPlaylist = loadPlaylist;
const loadSavedTotal = async (token) => {
    const { total } = await (0, api_1.getSavedTracks)(token, 0, 1);
    return total;
};
exports.loadSavedTotal = loadSavedTotal;
//# sourceMappingURL=services.js.map