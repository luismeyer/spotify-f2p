import fs from "fs";
import path from "path";

export const errorResponse = () => ({
  statusCode: 400,
  headers: {
    "Content-Type": "text/html",
  },
  body: fs
    .readFileSync(path.resolve(__dirname, "../../templates/error.html"))
    .toString(),
});
