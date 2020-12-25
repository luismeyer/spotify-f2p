import uniqid from "uniqid";
import { APIGatewayEvent } from "aws-lambda";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import Handlebars from "handlebars";
import { Bitly } from "bitly";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { allPlaylists } from "../app";
import { createTable, describeTable, putUserData } from "../app/aws";
import { generateAuthURL, getMe, getToken } from "../app/spotify";
import { isLocal, lambdaURL } from "../app/constants";

const { BITLY_TOKEN } = process.env;
if (!BITLY_TOKEN) {
  throw new Error("Missing Env Variable: BITLY_TOKEN");
}

const bitly = new Bitly(BITLY_TOKEN);

const setupTable = async () =>
  createTable()
    .then(async () => {
      // Wait for the Table to be fully created
      let table = await describeTable();

      while (table && table.TableStatus !== "ACTIVE") {
        await new Promise((res) => {
          setTimeout(res, 1000);
        });

        console.log("Creating table...");
        table = await describeTable();
      }
    })
    .catch(() => console.log("Table already exists"));

export const authHandler = async (event: APIGatewayEvent) => {
  // Redirect to Spotify API Auth
  if (!event.queryStringParameters || !event.queryStringParameters.code) {
    return {
      statusCode: 302,
      headers: {
        Location: generateAuthURL(),
      },
    };
  }

  const { code, playlistId, token } = event.queryStringParameters;
  console.log("PATH", event.path);

  // Save refresh Token and redirect to Sync Page
  if (playlistId && token) {
    await setupTable();

    const userId = uniqid();

    let url = `${lambdaURL}/sync?id=${userId}`;

    if (!isLocal) {
      url = await bitly.shorten(url).then((res) => res.link);
    }

    await putUserData(userId, token, playlistId, url);

    return {
      statusCode: 302,
      headers: {
        Location: url,
      },
    };
  }

  // Get all playlists an render them
  const { refreshToken, accessToken } = await getToken(code);

  const { id } = await getMe(accessToken);

  const playlists = await allPlaylists(accessToken).then((ps) =>
    ps
      .filter((p) => p.owner.id === id)
      .map((p) => ({
        name: p.name,
        link: `${lambdaURL}/auth?token=${refreshToken}&playlistId=${p.id}&code=used`,
      })),
  );

  const source = fs
    .readFileSync(path.resolve(__dirname, "../../templates/auth.html"))
    .toString();

  const template = Handlebars.compile(source);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: template({ playlists }),
  };
};
