import styled from "styled-components";

export const SpotifyImg = styled.img`
  max-height: 100px;
`;

export const LoginButton = styled.a`
  border: none;
  cursor: pointer;
  grid-gap: 8px;
  color: white;
`;

export const StageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  position: relative;
`;

export const ButtonContainer = styled.div`
  background-color: #1c2628;
  text-align: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 100px;
`;

export const NoteContainer = styled.div<{
  x: number;
  y: number;
  isWhite: boolean;
  rotation: number;
}>`
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;

  position: absolute;

  fill: ${(props) => (props.isWhite ? "white" : "#1c2628")};

  transform: rotate(${(props) => props.rotation}deg);
`;
