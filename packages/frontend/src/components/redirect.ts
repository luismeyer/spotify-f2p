import styled from "styled-components";

export const RedirectContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const RedirectTitle = styled.h1`
  position: absolute;
  top: 0;
  left: 30px;
  font-size: 50px;
  color: #1c2628;
`;

export const RedirectLeftView = styled.div`
  display: flex;
  position: relative;
`;

export const RedirectRightView = styled.div`
  background-color: #1c2628;
  color: white;
  padding: 30px 30px 0 30px;
  height: calc(100vh - 30px);
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
