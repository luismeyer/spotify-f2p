import type { ProxyResult } from "aws-lambda";

import { getMe, getToken, loadAllPlaylists } from "@spotify-f2p/spotify";

import { idResponse, playlistsResponse } from "./response";
import { frontendUrl } from "./handler";
import { saveUser } from "@spotify-f2p/aws";
import uniqid from "uniqid";
import { shortenUrl } from "./bitly";

// Fetch all playlists so the user can select one
export const handleCode = async (code: string): Promise<ProxyResult> => {
  const { refreshToken, accessToken } = await getToken(code, frontendUrl);

  const { id } = await getMe(accessToken);
  const rawPlaylists = await loadAllPlaylists(accessToken);

  const playlists = rawPlaylists
    .filter((p) => p.owner.id === id)
    .map((p) => ({
      name: p.name,
      url: `/backend/register?token=${refreshToken}&playlistId=${p.id}&code=used`,
    }));

  return playlistsResponse(playlists);
};

// Creates Bitly url and ends the auth process
export const handleTokenAndPlaylist = async (
  token: string,
  playlistId: string,
): Promise<ProxyResult> => {
  const userId = uniqid();
  const url = await shortenUrl(`${frontendUrl}/sync/${userId}`);

  await saveUser({ id: userId, token, playlistId, url });

  return idResponse(userId);
};
