import styled from "styled-components";
import { device } from "../styles";

export const RedirectContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  ${device.tablet} {
    height: 100dvh;
    grid-template-columns: 1fr 1fr;
  }
`;

export const RedirectTitle = styled.h1`
  position: absolute;
  margin: 0;
  top: 25px;
  left: 30px;
  right: 30px;
  color: #1c2628;

  ${device.tablet} {
    background-color: transparent;
  }
`;

export const RedirectLeftView = styled.div`
  display: flex;
  position: relative;
`;

export const RedirectRightView = styled.div`
  background-color: #1c2628;
  color: white;
  padding: 30px;
  display: grid;
  grid-gap: 20px;
  overflow: scroll;
`;

export const RedirectPlaylistName = styled.h2`
  cursor: pointer;
  margin: 0;

  :hover {
    color: #f3a13b;
  }
`;

export const RedirectNoteContainer = styled.div<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  right: 0px;
  transition: top 0.5s ease;
  fill: #f3a13b;
`;
