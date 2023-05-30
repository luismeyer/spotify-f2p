import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Note } from "../components/icons/note";
import { Window } from "../components/illustrations/window";
import { Loader } from "../components/loader";
import {
  RedirectContainer,
  RedirectLeftView,
  RedirectNoteContainer,
  RedirectPlaylistName,
  RedirectRightView,
  RedirectTitle,
} from "../components/redirect";
import { useIsDevice } from "../hooks/use-is-device";
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

  const { playlists, playlistsLoading } = usePlaylists(code);

  const { fetchSelectPlaylist, id, selectLoading } = useSelectPlaylist();

  const [top, setTop] = useState(-50);

  const isTablet = useIsDevice("tablet");

  // update the note indicator
  const handleMouseEnter = (event: React.MouseEvent<HTMLHeadingElement>) => {
    const name = event.target as HTMLHeadingElement;
    setTop(name.offsetTop);
  };

  // redirect to sync page if auth completed
  useEffect(() => {
    if (selectLoading || !id) {
      return;
    }

    navigate(`/sync/${id}`);
  }, [selectLoading]);

  // redirect to auth if auth error
  if (!playlistsLoading && !playlists.length) {
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
          playlists.map((playlist) => (
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
