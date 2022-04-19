import { Bitly } from "bitly";

const { BITLY_TOKEN } = process.env;
if (!BITLY_TOKEN) {
  throw new Error("Missing Env Variable: BITLY_TOKEN");
}

const bitly = new Bitly(BITLY_TOKEN);

export const shortenLink = (link: string) =>
  !process.env.AWS_SAM_LOCAL
    ? bitly.shorten(link).then((res) => res.link)
    : link;
