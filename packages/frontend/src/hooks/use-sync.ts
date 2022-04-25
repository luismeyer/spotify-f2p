import { SyncResponse } from "@spotify-f2p/api";
import { useState, useRef } from "react";

export const useSync = () => {
  const [loading, setLoading] = useState(true);

  const bitlyUrl = useRef<string | undefined>();
  const count = useRef<number | undefined>();

  const query = (id: string) => {
    fetch(`${BACKEND_URL}/sync?id=${id}`)
      .then((res) => res.json())
      .then((body: SyncResponse) => {
        setLoading(false);

        if (!body.success) {
          return;
        }

        count.current = body.count;
        bitlyUrl.current = body.bitlyUrl;
      });
  };

  return {
    loading,
    count,
    bitlyUrl,
    fetchSync: query,
  };
};
