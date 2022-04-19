import AWS from "aws-sdk";

import { TokenDatabaseResponse } from "./typings";

AWS.config.region = "eu-central-1";

const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const converter = AWS.DynamoDB.Converter;

// TODO
const TableName = "test";

export const putUserData = (
  id: string,
  token: string,
  playlistId?: string,
  url?: string,
) =>
  dynamodb
    .putItem({
      TableName,
      Item: converter.marshall({
        id,
        token,
        playlistId,
        url,
      }),
    })
    .promise();

export const getUserData = (id: string) =>
  dynamodb
    .getItem({
      TableName,
      Key: converter.marshall({
        id,
      }),
    })
    .promise()
    .then((res) =>
      res.Item
        ? (converter.unmarshall(res.Item) as TokenDatabaseResponse)
        : undefined,
    );
