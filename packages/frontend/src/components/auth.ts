import styled from "styled-components";
import { device } from "../styles";

export const AuthSpotify = styled.img`
  max-height: 100px;
`;

export const AuthLogin = styled.a`
  border: none;
  cursor: pointer;
  grid-gap: 8px;
  color: white;
`;

export const AuthContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  position: relative;

  ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const AuthLeftView = styled.div`
  background-color: #1c2628;
  text-align: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 100px;
  grid-row: 2;
  height: 100vh;

  ${device.tablet} {
    grid-row: 1;
  }
`;

export const AuthNoteContainer = styled.div<{
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

export const AuthRightView = styled.div`
  display: flex;
  max-height: 100vh;
`;
