import React, { useEffect, useRef } from "react";

import Logo from "../assets/spotify.png";
import { useAuthUrl } from "../../hooks/use-auth-url";
import { Note, NoteBig } from "../icons/note";
import { Phone } from "../illustrations/phone";
import {
  ButtonContainer,
  LoginButton,
  NoteContainer,
  SpotifyImg,
  StageContainer,
} from "./styles";

export const AuthStage: React.FC = () => {
  const { url } = useAuthUrl();

  const containerRef = useRef<HTMLDivElement>(null);

  const notes = useRef<JSX.Element[]>([]);

  useEffect(() => {
    if (!containerRef.current || notes.current.length) {
      return;
    }

    for (let i = 0; i < 10; i++) {
      const x = Math.floor(
        containerRef.current.clientWidth * 0.75 * Math.random(),
      );

      const y = Math.floor(
        (containerRef.current.clientHeight / 3) * Math.random(),
      );

      const isWhite = x < containerRef.current.clientWidth / 2;

      notes.current = [
        ...notes.current,
        <NoteContainer
          key={i}
          x={x}
          y={y}
          isWhite={isWhite}
          rotation={Math.floor(-45 * Math.random())}
        >
          {Math.floor(Math.random() * 2) === 1 ? <Note /> : <NoteBig />}
        </NoteContainer>,
      ];
    }
  }, [containerRef]);

  return (
    <StageContainer ref={containerRef}>
      <ButtonContainer>
        <h1>Logge dich mit deinem Spotify-Account ein</h1>

        {
          <LoginButton
            href={url?.current}
            className="animate__animated animate__bounceIn"
          >
            <SpotifyImg src={Logo} />
          </LoginButton>
        }
      </ButtonContainer>
      <div>
        <Phone />
      </div>

      {notes.current.map((note) => note)}
    </StageContainer>
  );
};
