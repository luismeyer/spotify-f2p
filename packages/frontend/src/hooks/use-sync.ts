import useSWRImmutable from "swr/immutable";

import { SyncResponse } from "@spotify-f2p/api";

export const useSync = (id: string) => {
  const { isLoading, data } = useSWRImmutable<SyncResponse>(`/sync?id=${id}`);

  return {
    isLoading,
    data,
  };
};
