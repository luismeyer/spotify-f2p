import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthPage } from "./pages/auth";
import { RedirectPage } from "./pages/redirect";
import { SyncPage } from "./pages/sync";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/sync/:id" element={<SyncPage />} />

        <Route path="/redirect" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
};
