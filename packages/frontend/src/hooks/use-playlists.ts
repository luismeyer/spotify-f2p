import { PlaylistsResponse, SimplePlaylist } from "@spotify-f2p/api";
import { useState, useRef } from "react";

export const usePlaylists = () => {
  const [loading, setLoading] = useState(true);
  const playlists = useRef<SimplePlaylist[] | undefined>();

  const query = (code: string) => {
    fetch(`${BACKEND_URL}/auth?code=${code}`)
      .then((res) => res.json())
      .then((body: PlaylistsResponse) => {
        setLoading(false);

        if (!body.success) {
          return;
        }

        playlists.current = body.playlists;
      });
  };

  return {
    loading,
    playlists,
    fetchPlaylists: query,
  };
};
