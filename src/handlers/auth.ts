import uniqid from "uniqid";
import { APIGatewayEvent } from "aws-lambda";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import Handlebars from "handlebars";

const configPath = path.resolve(__dirname, "../../secrets/.env");
dotenv.config({ path: configPath });

import { allPlaylists } from "../app";
import { createTable, describeTable, putRefreshToken } from "../app/aws";
import { generateAuthURL, getToken } from "../app/spotify";

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
      statusCode: 301,
      headers: {
        Location: generateAuthURL(),
      },
    };
  }

  const { code, playlistId, token } = event.queryStringParameters;

  // Save refresh Token and redirect to Sync Page
  if (playlistId && token) {
    await setupTable();

    const id = uniqid();
    await putRefreshToken(id, token, playlistId);

    return {
      statusCode: 301,
      headers: {
        Location: `/sync?id=${id}`,
      },
    };
  }

  // Get all playlists an render them
  const { refreshToken, accessToken } = await getToken(code);

  const playlists = await allPlaylists(accessToken).then((ps) =>
    ps.map(({ name, id }) => ({
      name,
      link: `/auth?token=${refreshToken}&playlistId=${id}&code=used`,
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
