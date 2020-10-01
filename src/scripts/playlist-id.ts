import meow from "meow";
import dotenv from "dotenv";
dotenv.config();

import { refreshToken } from "../app/spotify";
import { searchPlaylists } from "../app";

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
