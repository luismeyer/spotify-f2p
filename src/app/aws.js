const AWS = require("aws-sdk");
const { RefreshTokenKey } = require("./constants");

AWS.config = {
  region: "eu-central-1",
  apiVersions: {
    secretsmanager: "2017-10-17",
  },
};

const secretsmanager = new AWS.SecretsManager();

module.exports.putRefreshToken = (secret) =>
  secretsmanager
    .putSecretValue({
      SecretId: RefreshTokenKey,
      SecretString: secret,
    })
    .promise();

module.exports.getRefreshToken = () =>
  secretsmanager
    .getSecretValue({
      SecretId: RefreshTokenKey,
    })
    .promise();

module.exports.describeRefreshToken = () =>
  secretsmanager
    .describeSecret({
      SecretId: RefreshTokenKey,
    })
    .promise();

module.exports.createRefreshTokenSecret = () =>
  secretsmanager
    .createSecret({
      Name: RefreshTokenKey,
    })
    .promise();
