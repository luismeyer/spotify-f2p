export type UserData = {
    id: string;
    token: string;
    playlistId?: string;
    url?: string;
};
export declare const saveUser: import("duenamodb").PutItemFunction<UserData>;
export declare const updateUser: import("duenamodb").UpdateItemFunction<UserData>;
export declare const getUser: import("duenamodb").GetItemFunction<UserData, string>;
