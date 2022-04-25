import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Note } from "../components/icons/note";
import { Window } from "../components/illustrations/window";
import {
  RedirectContainer,
  RedirectLeftView,
  RedirectNoteContainer,
  RedirectPlaylistName,
  RedirectRightView,
  RedirectTitle,
} from "../components/redirect";
import { usePlaylists } from "../hooks/use-playlists";
import { useQuery } from "../hooks/use-query";
import { useSelectPlaylist } from "../hooks/use-select-playlist";

export const RedirectPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const code = query.get("code");
  if (!code) {
    navigate("/auth");

    return null;
  }

  const {
    fetchPlaylists,
    playlists,
    loading: playlistsLoading,
  } = usePlaylists();

  const { fetchSelectPlaylist, id, loading: idLoading } = useSelectPlaylist();

  const [top, setTop] = useState(-50);

  useEffect(() => {
    fetchPlaylists(code);
  }, []);

  const handleMouseEnter = (event: React.MouseEvent<HTMLHeadingElement>) => {
    const name = event.target as HTMLHeadingElement;
    setTop(name.offsetTop);
  };

  useEffect(() => {
    if (idLoading || !id.current) {
      return;
    }

    navigate(`/sync/${id.current}`);
  }, [idLoading]);

  return (
    <RedirectContainer>
      <RedirectLeftView>
        <RedirectTitle>Playlists</RedirectTitle>
        <Window />

        <RedirectNoteContainer top={top}>
          <Note />
        </RedirectNoteContainer>
      </RedirectLeftView>

      <RedirectRightView>
        {!playlistsLoading &&
          playlists.current &&
          playlists.current?.map((playlist) => (
            <RedirectPlaylistName
              onClick={() => fetchSelectPlaylist(playlist.url)}
              onMouseEnter={handleMouseEnter}
              key={playlist.name}
            >
              {playlist.name}
            </RedirectPlaylistName>
          ))}
      </RedirectRightView>
    </RedirectContainer>
  );
};
