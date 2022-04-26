import styled from "styled-components";

export const RandomNoteContainer = styled.div<{
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
