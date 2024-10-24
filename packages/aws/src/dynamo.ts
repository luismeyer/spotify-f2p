import {
  createGetItem,
  createPutItem,
  createUpdateItem,
  DDBClient,
} from "duenamodb";

import { isDev } from "./dev";

const params = isDev
  ? {
      region: "localhost",
      endpoint: "http://localhost:8000",
      accessKeyId: "DEFAULT_ACCESS_KEY",
      secretAccessKey: "DEFAULT_SECRET",
    }
  : { region: "eu-central-1" };

DDBClient.params = params;

const { TABLE_NAME } = process.env;

if (!TABLE_NAME) {
  throw new Error("Missing Env Variable: TABLE_NAME");
}

export type UserData = {
  id: string;
  token: string;
  playlistId?: string;
  url?: string;
  syncedAt?: number;
  lockedAt?: number | null;
};

export const saveUser = createPutItem<UserData>(TABLE_NAME);

export const updateUser = createUpdateItem<UserData>(TABLE_NAME, "id");

export const getUser = createGetItem<UserData, string>(TABLE_NAME, "id");
