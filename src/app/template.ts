import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { successResponse } from "./aws";
import { baseUrl } from "./constants";

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

  const page = defaultTemplate(apiTemplate({ songs, bitlyUrl: url }));

  return successResponse(page);
};

export const syncResponse = (id: string, stage: string) => {
  const syncContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/sync.html"))
    .toString();

  const template = Handlebars.compile(syncContent);
  const page = defaultTemplate(template({ id, baseUrl: baseUrl(stage) }));

  return successResponse(page);
};

export const errorResponse = (stage: string) => {
  const errorContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/error.html"))
    .toString();

  const template = Handlebars.compile(errorContent);
  const page = defaultTemplate(template({ baseUrl: baseUrl(stage) }));

  return {
    statusCode: 400,
    headers: { "Content-Type": "text/html" },
    body: defaultTemplate(page),
  };
};

export const timeoutResponse = (message: string, stage: string) => {
  const timeoutContent = fs
    .readFileSync(path.resolve(__dirname, "../../templates/gateway.html"))
    .toString();

  const template = Handlebars.compile(timeoutContent);
  const content = template({ message });

  return {
    statusCode: 400,
    headers: { "Content-Type": "text/html" },
    body: defaultTemplate(content),
  };
};
