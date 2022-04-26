import { PlaylistsResponse, SimplePlaylist } from "@spotify-f2p/api";
import { useState, useRef, useEffect } from "react";

export const usePlaylists = (code: string) => {
  const [loading, setLoading] = useState(true);
  const playlists = useRef<SimplePlaylist[] | undefined>();

  useEffect(() => {
    fetch(`${BACKEND_URL}/auth?code=${code}`)
      .then((res) => res.json())
      .then((body: PlaylistsResponse) => {
        setLoading(false);

        if (!body.success) {
          return;
        }

        playlists.current = body.playlists;
      });
  }, []);

  return {
    loading,
    playlists,
  };
};
