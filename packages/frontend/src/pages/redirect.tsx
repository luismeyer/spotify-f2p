import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePlaylists } from "../hooks/use-playlists";
import { useQuery } from "../hooks/use-query";

export const RedirectPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const { fetchPlaylists, loading, playlists } = usePlaylists();

  useEffect(() => {
    const code = query.get("code");
    if (!code) {
      return navigate("/auth");
    }

    fetchPlaylists(code);
  }, []);

  return (
    <div>
      <h1>Playlists</h1>

      {!loading &&
        playlists.current &&
        playlists.current?.map((playlist) => (
          <div key={playlist.name}>
            <h2>{playlist.name}</h2>
          </div>
        ))}
    </div>
  );
};
