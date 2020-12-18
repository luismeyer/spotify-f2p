const open = require("open");
const fetch = require("node-fetch");
const express = require("express");
const querystring = require("querystring");
const dotenv = require("dotenv");
const path = require("path");

const configPath = path.resolve(__dirname, "../secrets/.env");
dotenv.config({ path: configPath });

const {
  putRefreshToken,
  describeTable,
  createTable,
} = require("../build/app/aws");

const { CLIENT_ID, CLIENT_SECRET, PLAYLIST_ID } = process.env;

if (!CLIENT_ID) throw Error("Missing Env: 'CLIENT_ID'");
if (!CLIENT_SECRET) throw Error("Missing Env: 'CLIENT_SECRET'");
if (!PLAYLIST_ID) throw Error("Missing Env: 'PLAYLIST_ID'");

const SPOTIFY_BASIC_HEADER =
  "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

const redirect_uri = "http://localhost:8080/callback";
let safedState;

const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null || state !== safedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        }),
    );
  } else {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: SPOTIFY_BASIC_HEADER,
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
    })
      .then((res) => res.json())
      .then(async (body) => {
        const { access_token, refresh_token } = body;

        // Create Dynamodb Table
        await createTable().catch(() =>
          console.log("Tabelle existiert bereits"),
        );

        // Wait for the Table to be fully created
        let table = await describeTable();
        while (table.TableStatus !== "ACTIVE") {
          await new Promise((res) => {
            setTimeout(res, 1000);
          });

          console.log("Creating table...");
          table = await describeTable();
        }

        // Save the refreshtoken
        await putRefreshToken(refresh_token);

        res.status(200).send("Success: you can close this window");

        console.log(
          `Refresh Token: ${refresh_token}\nAccess Token: ${access_token}`,
        );

        server.close();
        process.exit();
      });
  }
});

const server = app.listen(8080);

const state = generateRandomString(16);
safedState = state;

// your application requests authorization
const scope =
  "playlist-modify-public playlist-read-private user-library-read playlist-modify-private user-read-email user-read-private";

open(
  "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri,
      state,
      show_dialog: true,
    }),
);
