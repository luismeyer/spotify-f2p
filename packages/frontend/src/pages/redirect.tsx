import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";

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
import { useIsDevice } from "../hooks/use-is-device";

export const RedirectPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const code = query.get("code");
  if (!code) {
    navigate("/auth");

    return null;
  }

  const { playlists, loading: playlistsLoading } = usePlaylists(code);

  const { fetchSelectPlaylist, id, loading: idLoading } = useSelectPlaylist();

  const [top, setTop] = useState(-50);

  const isTablet = useIsDevice("tablet");

  // update the note indicator
  const handleMouseEnter = (event: React.MouseEvent<HTMLHeadingElement>) => {
    const name = event.target as HTMLHeadingElement;
    setTop(name.offsetTop);
  };

  // redirect to sync page if auth completed
  useEffect(() => {
    if (idLoading || !id.current) {
      return;
    }

    navigate(`/sync/${id.current}`);
  }, [idLoading]);

  // redirect to auth if auth error
  if (!playlistsLoading && !playlists.current?.length) {
    navigate("/auth");
    return null;
  }

  return (
    <RedirectContainer>
      <RedirectLeftView>
        <RedirectTitle>
          In welcher Playlist sollen deine Lieblingssongs gespeichert werden?
        </RedirectTitle>
        <Window />

        {isTablet && (
          <RedirectNoteContainer top={top}>
            <Note />
          </RedirectNoteContainer>
        )}
      </RedirectLeftView>

      <RedirectRightView>
        {playlistsLoading && <Loader />}

        {!playlistsLoading &&
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
