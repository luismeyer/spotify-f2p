const meow = require("meow");
const dotenv = require("dotenv");
const path = require("path");

const configPath = path.resolve(__dirname, "../secrets/.env");
dotenv.config({ path: configPath });

const { refreshToken } = require("../build/app/spotify");
const { searchPlaylists } = require("../build/app");

const cli = meow(
  `
    Usage
      $ search-playlist [options]
    Options
      --name, -n  Playlist name
`,
  {
    flags: {
      name: {
        type: "string",
        alias: "n",
      },
    },
  }
);

const { name } = cli.flags;

(async () => {
  const token = await refreshToken();
  if (!token) throw Error("Missing token");
  if (!name) throw Error("Missing name flag");

  const playlist = await searchPlaylists(token, name);
  if (playlist) {
    console.log("Name: ", playlist.name);
    console.log("Id: ", playlist.id);
  } else {
    console.log("No Playlist found");
  }
})();
