import useSWRImmutable from "swr/immutable";

import { PlaylistsResponse } from "@spotify-f2p/api";

export const usePlaylists = (code: string) => {
  const { data, isLoading } = useSWRImmutable<PlaylistsResponse>(
    `/playlists?code=${code}`,
  );

  return {
    playlistsLoading: isLoading,
    playlists: data?.success ? data.playlists : [],
  };
};
