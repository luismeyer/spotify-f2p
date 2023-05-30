import styled from "styled-components";

import { device } from "../styles";

const LeftPadding = 50;

export const SyncContainer = styled.div`
  display: grid;
  height: 100dvh;
  grid-template-columns: 1fr;
  overflow: hidden;

  ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const SyncLeftView = styled.div`
  background-color: #1c2628;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${LeftPadding}px;
  min-height: 30vh;
`;

export const SyncRightView = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CopyInput = styled.input`
  cursor: pointer;
  border: none;
  font-size: 20px;
  font-weight: bold;
  outline: none;
  width: 100%;
  text-align: center;
  color: white;
  background-color: transparent;
`;

export const SyncTitle = styled.h1`
  margin-top: 0;
`;
