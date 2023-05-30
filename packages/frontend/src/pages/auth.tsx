import React, { useRef, useState } from "react";

import Logo from "../assets/spotify.png";
import {
  AuthContainer,
  AuthLeftView,
  AuthLogin,
  AuthRightView,
  AuthSpotify,
} from "../components/auth";

import { Phone } from "../components/illustrations/phone";
import { useAuthUrl } from "../hooks/use-auth-url";
import { useIsDevice } from "../hooks/use-is-device";
import { useRandomNotes } from "../hooks/use-random-notes";

export const AuthPage: React.FC = () => {
  const { url, loading } = useAuthUrl();

  const containerRef = useRef<HTMLDivElement>(null);
  const notes = useRef<JSX.Element[]>([]);

  const [buttonHovered, setButtonHovered] = useState(false);

  const isTablet = useIsDevice("tablet");

  useRandomNotes(containerRef, notes, { maxX: 0.75, maxY: 1 / 3 });

  const linkClass =
    "animate__animated " + (buttonHovered ? "animate__tada" : "");

  return (
    <AuthContainer ref={containerRef}>
      <AuthLeftView>
        <h1>Melde dich hier mit Spotify an</h1>

        {!loading && (
          <AuthLogin
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            href={url}
            className={linkClass}
          >
            <AuthSpotify src={Logo} />
          </AuthLogin>
        )}
      </AuthLeftView>

      <AuthRightView>
        <Phone />
      </AuthRightView>

      {isTablet && notes.current.map((note) => note)}
    </AuthContainer>
  );
};
