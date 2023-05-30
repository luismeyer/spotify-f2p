import useSWRImmutable from "swr/immutable";

import { UrlResponse } from "@spotify-f2p/api";

export const useAuthUrl = () => {
  const { data, isLoading } = useSWRImmutable<UrlResponse>("/auth");

  return {
    loading: isLoading,
    url: data?.success ? data.url : "",
  };
};
