import { Bitly } from "bitly";

import { isDev } from "@spotify-f2p/aws";

const { BITLY_SECRET } = process.env;
if (!BITLY_SECRET) {
  throw new Error("Missing Env Variable: BITLY_SECRET");
}

const bitly = new Bitly(BITLY_SECRET);

export const shortenUrl = (url: string) =>
  isDev ? url : bitly.shorten(url).then((res) => res.link);
