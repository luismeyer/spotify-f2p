import AWS from "aws-sdk";
import { TableName } from "../constants";
import { TokenDatabaseResponse } from "../typings";

AWS.config.region = "eu-central-1";

const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const converter = AWS.DynamoDB.Converter;

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

const describeTable = () =>
  dynamodb
    .describeTable({
      TableName,
    })
    .promise()
    .then((res) => res.Table);

const createTable = () =>
  dynamodb
    .createTable({
      TableName,
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    })
    .promise();

export const setupTable = async () =>
  createTable()
    .then(async () => {
      // Wait for the Table to be fully created
      let table = await describeTable();

      while (table && table.TableStatus !== "ACTIVE") {
        await new Promise((res) => {
          setTimeout(res, 1000);
        });

        console.log("Creating table...");
        table = await describeTable();
      }
    })
    .catch(() => console.log("Table already exists"));
