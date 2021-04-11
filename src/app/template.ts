import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { successResponse } from "./aws";

const defaultTemplate = (content: string) => {
  const defaultPage = fs
    .readFileSync(path.resolve(__dirname, "../../templates/page.html"))
    .toString();

  const template = Handlebars.compile(defaultPage);
  return template({ content });
};

export const authResponse = (
  playlists: {
    name: string;
    link: string;
  }[],
) => {
  const authContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/auth.html"))
    .toString();

  const authTemplate = Handlebars.compile(authContent);
  const page = defaultTemplate(authTemplate({ playlists }));

  return successResponse(page);
};

export const apiResponse = (songs: string, url: string) => {
  const apiContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/api.html"))
    .toString();

  const apiTemplate = Handlebars.compile(apiContent);

  const page = defaultTemplate(
    apiTemplate({
      songs,
      bitlyUrl: url,
    }),
  );

  return successResponse(page);
};

export const syncResponse = (id: string, baseUrl: string) => {
  const syncContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/sync.html"))
    .toString();

  const template = Handlebars.compile(syncContent);
  const page = defaultTemplate(
    template({
      id,
      baseUrl,
    }),
  );

  return successResponse(page);
};

export const errorResponse = () => {
  const errorContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/error.html"))
    .toString();

  return {
    statusCode: 400,
    headers: {
      "Content-Type": "text/html",
    },
    body: defaultTemplate(errorContent),
  };
};
