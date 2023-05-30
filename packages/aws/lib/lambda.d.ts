import { ProxyResult } from "aws-lambda";
import { Lambda } from "aws-sdk";
export declare const errorResponse: (message: string) => ProxyResult;
export declare const successResponse: <T extends object>(content: T) => ProxyResult;
export declare const invokeSyncLambda: <T extends object>(name: string, payload: T) => Promise<import("aws-sdk/lib/request").PromiseResult<Lambda.InvocationResponse, import("aws-sdk").AWSError>>;
