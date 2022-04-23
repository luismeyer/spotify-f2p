import { Bitly } from "bitly";

const { BITLY_SECRET } = process.env;
if (!BITLY_SECRET) {
  throw new Error("Missing Env Variable: BITLY_SECRET");
}

const bitly = new Bitly(BITLY_SECRET);

export const shortenUrl = (url: string) =>
  process.env.AWS_SAM_LOCAL ? url : bitly.shorten(url).then((res) => res.link);
