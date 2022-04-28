import { useEffect, useRef, useState } from "react";

import { UrlResponse } from "@spotify-f2p/api";

import { backendBasePath } from "../const";

export const useAuthUrl = () => {
  const [loading, setLoading] = useState(true);
  const url = useRef<string | undefined>();

  useEffect(() => {
    fetch(`${BACKEND_URL}/${backendBasePath}`)
      .then((res) => res.json())
      .then((body: UrlResponse) => {
        setLoading(false);

        if (!body.success) {
          return;
        }

        url.current = body.url;
      });
  }, []);

  return {
    loading,
    url,
  };
};
