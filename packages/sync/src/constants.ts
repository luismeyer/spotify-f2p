export const TableName = "SpotifyTokenTable";

const { AWS_SAM_LOCAL, LAMDBA_URL } = process.env;

export const isLocal = AWS_SAM_LOCAL;

export const lambdaURL = isLocal ? "http://localhost:3000" : LAMDBA_URL;

export const baseUrl = (stage: string) =>
  !isLocal && stage ? `/${stage}` : "";
