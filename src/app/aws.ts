import AWS from "aws-sdk";
import { RefreshTokenKey, TableName } from "./constants";

AWS.config.region = "eu-central-1";

const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const converter = AWS.DynamoDB.Converter;

export const putRefreshToken = (secret: string) =>
  dynamodb
    .putItem({
      TableName,
      Item: converter.marshall({
        id: RefreshTokenKey,
        value: secret,
      }),
    })
    .promise();

export const getRefreshToken = (): Promise<string> =>
  dynamodb
    .getItem({
      TableName,
      Key: converter.marshall({
        id: RefreshTokenKey,
      }),
    })
    .promise()
    .then((res) => (res.Item ? converter.output(res.Item.value) : ""));

export const describeTable = () =>
  dynamodb
    .describeTable({
      TableName,
    })
    .promise()
    .then((res) => res.Table);

export const createTable = () =>
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
