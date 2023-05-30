import { IdResponse } from "@spotify-f2p/api";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

export const useSelectPlaylist = () => {
  const [url, setUrl] = useState<string>();

  const { data, isLoading } = useSWRImmutable<IdResponse>(url);

  const fetchSelectPlaylist = async (url: string) => {
    setUrl(url);
  };

  return {
    selectLoading: isLoading,
    fetchSelectPlaylist,
    id: data?.success ? data.id : undefined,
  };
};
