import AWS from "aws-sdk";
import { TableName } from "./constants";

AWS.config.region = "eu-central-1";

const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const converter = AWS.DynamoDB.Converter;

const { AWS_SAM_LOCAL } = process.env;

export const putRefreshToken = (
  id: string,
  token: string,
  playlistId?: string,
) =>
  dynamodb
    .putItem({
      TableName,
      Item: converter.marshall({
        id,
        token,
        playlistId,
      }),
    })
    .promise();

export const getRefreshToken = (id: string): Promise<string> =>
  dynamodb
    .getItem({
      TableName,
      Key: converter.marshall({
        id,
      }),
    })
    .promise()
    .then((res) => (res.Item ? converter.output(res.Item.token) : ""));

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

export const lambdaBaseUrl = AWS_SAM_LOCAL ? "" : "/Prod";
