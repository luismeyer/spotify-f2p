import useSWRImmutable from "swr/immutable";

import type { SyncResponse } from "@spotify-f2p/api";

export const useSync = (id: string) => {
  const { isLoading, data, mutate } = useSWRImmutable<SyncResponse>(
    `/sync?id=${id}`,
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return {
    isLoading,
    data,
    mutate,
  };
};
