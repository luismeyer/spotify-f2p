require("dotenv").config();

const meow = require("meow");

const { refreshToken } = require("../app/spotify");
const { searchPlaylists } = require("../app");

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
  if (!token) {
    throw Error("Missing token");
  }

  const playlist = await searchPlaylists(token, name);
  console.log("Name: ", playlist.name);
  console.log("Id: ", playlist.id);
})();
