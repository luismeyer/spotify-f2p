import { ProxyResult } from "aws-lambda";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const errorResponse = (message: string): ProxyResult => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json", ...corsHeaders },
  body: JSON.stringify({
    success: false,
    message,
  }),
});

export const successResponse = <T extends object>(content: T): ProxyResult => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json", ...corsHeaders },
  body: JSON.stringify({
    success: true,
    ...content,
  }),
});
