import React, { useEffect, useRef, useState } from "react";

import Logo from "../assets/spotify.png";
import {
  AuthContainer,
  AuthLeftView,
  AuthLogin,
  AuthNoteContainer,
  AuthRightView,
  AuthSpotify,
} from "../components/auth";
import { Note, NoteBig } from "../components/icons/note";
import { Phone } from "../components/illustrations/phone";
import { useAuthUrl } from "../hooks/use-auth-url";

export const AuthPage: React.FC = () => {
  const { url } = useAuthUrl();

  const containerRef = useRef<HTMLDivElement>(null);

  const notes = useRef<JSX.Element[]>([]);

  const [buttonHovered, setButtonHovered] = useState(false);

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
        <AuthNoteContainer
          key={i}
          x={x}
          y={y}
          isWhite={isWhite}
          rotation={Math.floor(-45 * Math.random())}
        >
          {Math.floor(Math.random() * 2) === 1 ? <Note /> : <NoteBig />}
        </AuthNoteContainer>,
      ];
    }
  }, [containerRef]);

  const linkClass =
    "animate__animated " + (buttonHovered ? "animate__tada" : "");

  return (
    <AuthContainer ref={containerRef}>
      <AuthLeftView>
        <h1>Logge dich mit deinem Spotify-Account ein</h1>

        <AuthLogin
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          href={url?.current}
          className={linkClass}
        >
          <AuthSpotify src={Logo} />
        </AuthLogin>
      </AuthLeftView>

      <AuthRightView>
        <Phone />
      </AuthRightView>

      {notes.current.map((note) => note)}
    </AuthContainer>
  );
};
