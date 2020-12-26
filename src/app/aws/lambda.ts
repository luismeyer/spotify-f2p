import { ProxyResult } from "aws-lambda";

export const redirectResponse = (location: string): ProxyResult => ({
  statusCode: 302,
  headers: {
    Location: location,
  },
  body: "",
});

export const successResponse = (htmlString: string): ProxyResult => ({
  statusCode: 200,
  headers: {
    "Content-Type": "text/html",
  },
  body: htmlString,
});
