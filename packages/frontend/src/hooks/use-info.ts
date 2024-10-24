import useSWRImmutable from "swr/immutable";

import type { InfoResponse } from "@spotify-f2p/api";
import { useEffect, useState } from "react";

export const useInfo = (id: string, paused: boolean) => {
  const [blocked, setBlocked] = useState(false);

  const { isLoading, data, mutate } = useSWRImmutable<InfoResponse>(
    `/info?id=${id}`,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      refreshInterval: !blocked || paused ? undefined : 1000,
    },
  );

  useEffect(() => {
    if (isLoading || !data?.success) {
      return;
    }

    if (blocked !== data.blocked) {
      setBlocked(data.blocked ?? false);
    }
  }, [blocked, isLoading, data]);

  return {
    isLoading,
    data,
    mutate,
  };
};
