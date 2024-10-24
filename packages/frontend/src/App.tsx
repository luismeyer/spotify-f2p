import type React from "react";
import { useCallback } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { type BareFetcher, SWRConfig } from "swr";

import { backendBasePath } from "./const";
import { AuthPage } from "./pages/auth";
import { RedirectPage } from "./pages/redirect";
import { SyncPage } from "./pages/sync";

export const App: React.FC = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/auth" /> },
    { path: "/auth", element: <AuthPage /> },
    { path: "/sync/:id", element: <SyncPage /> },
    { path: "/redirect", element: <RedirectPage /> },
  ]);

  const fetcher: BareFetcher = useCallback(
    (resource, init) =>
      fetch(`${BACKEND_URL}/${backendBasePath}${resource}`, init)
        .then((res) => res.json())
        .catch((err) => console.error(err)),
    [],
  );

  return (
    <SWRConfig value={{ fetcher }}>
      <RouterProvider router={router} />{" "}
    </SWRConfig>
  );
};
