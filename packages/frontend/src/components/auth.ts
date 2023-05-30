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
  position: relative;
  grid-template-columns: 1fr;
  overflow: hidden;
  height: 100dvh;

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
  padding: 50px;
`;

export const AuthRightView = styled.div`
  display: flex;
`;
