import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";

// https://vitejs.dev/config/
export default () => {
  const result = dotenv.config({ path: "../../.env" });

  const backendUrl = process.env.BACKEND_URL ?? result.parsed?.BACKEND_URL;

  return defineConfig({
    plugins: [react()],
    define: {
      BACKEND_URL: JSON.stringify(backendUrl),
    },
    server: {
      port: 8080,
    },
  });
};
