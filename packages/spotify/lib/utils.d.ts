export declare const chunkArray: <T>(array: T[], chunk: number) => T[][];
export declare const asyncIteration: <T, R>(array: T[][], fc: (array: T[]) => Promise<R>) => Promise<void>;
