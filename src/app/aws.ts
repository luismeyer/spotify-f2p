import AWS from "aws-sdk";
import { RefreshTokenKey } from "./constants";

AWS.config.region = "eu-central-1";
AWS.config.apiVersion = "2017-10-17";

const secretsmanager = new AWS.SecretsManager();

export const putRefreshToken = (secret: string) =>
  secretsmanager
    .putSecretValue({
      SecretId: RefreshTokenKey,
      SecretString: secret,
    })
    .promise();

export const getRefreshToken = () =>
  secretsmanager
    .getSecretValue({
      SecretId: RefreshTokenKey,
    })
    .promise();

export const describeRefreshToken = () =>
  secretsmanager
    .describeSecret({
      SecretId: RefreshTokenKey,
    })
    .promise();

export const createRefreshTokenSecret = () =>
  secretsmanager
    .createSecret({
      Name: RefreshTokenKey,
    })
    .promise();
