import { IdResponse } from "@spotify-f2p/api";
import { useState, useRef } from "react";

export const useSelectPlaylist = () => {
  const [loading, setLoading] = useState(true);
  const id = useRef<string | undefined>();

  const query = (url: string) => {
    fetch(`${BACKEND_URL}${url}`)
      .then((res) => res.json())
      .then((body: IdResponse) => {
        setLoading(false);

        if (!body.success) {
          return;
        }

        id.current = body.id;
      });
  };

  return {
    loading,
    id,
    fetchSelectPlaylist: query,
  };
};
