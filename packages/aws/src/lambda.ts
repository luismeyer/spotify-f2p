import { ProxyResult } from "aws-lambda";

export const errorResponse = (message: string): ProxyResult => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    success: false,
    message,
  }),
});

export const successResponse = <T extends object>(content: T): ProxyResult => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    success: true,
    ...content,
  }),
});
