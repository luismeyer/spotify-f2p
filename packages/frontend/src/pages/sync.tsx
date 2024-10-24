import type React from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { de } from "date-fns/locale";

import { Dance } from "../components/illustrations/dance";
import { Loader } from "../components/loader";
import {
  Button,
  CopyInput,
  SyncContainer,
  SyncLeftView,
  SyncRightView,
  SyncTitle,
} from "../components/sync";
import { useSync } from "../hooks/use-sync";
import { useInfo } from "../hooks/use-info";
import { formatDistanceToNow } from "date-fns";

type SyncParams = {
  id: string;
};

export const SyncPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<SyncParams>();

  const urlRef = useRef<HTMLInputElement>(null);

  if (!id) {
    navigate("/auth");

    return null;
  }

  const { isLoading, data, mutate } = useSync(id);
  const { isLoading: isInfoLoading, data: infoData } = useInfo(
    id,
    data?.success ?? false,
  );

  const copy = () => {
    if (!urlRef.current || !data?.success) {
      return;
    }

    /* Select the text field */
    urlRef.current.select();
    urlRef.current.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(data.bitlyUrl);
  };

  if (isInfoLoading) {
    return null;
  }

  return (
    <SyncContainer>
      <SyncLeftView>
        {(isLoading || (infoData?.success && infoData.blocked)) && (
          <Loader caption={id} />
        )}

        {!isLoading && data && !data.success && (
          <span>Ein Fehler is aufgetreten</span>
        )}

        {!isLoading &&
          !data?.success &&
          infoData?.success &&
          !infoData.blocked && (
            <div>
              <SyncTitle>
                Zuletzt vor{" "}
                {formatDistanceToNow(infoData.syncedAt, { locale: de })}{" "}
                aktualisiert
              </SyncTitle>
              <Button type="button" onClick={() => mutate()}>
                Synchronisieren
              </Button>
            </div>
          )}

        {!isLoading && data?.success && (
          <>
            {data.count === 0 ? (
              <SyncTitle>
                <i>{data.playlistName}</i> ist up to date!
              </SyncTitle>
            ) : (
              <SyncTitle>
                Es werden {Math.abs(data.count)} Songs{" "}
                {data.count > 0 ? " zu " : " aus "}
                <i>{data.playlistName}</i>
                {data.count > 0 ? " hinzugefügt." : " gelöscht."}
              </SyncTitle>
            )}

            <span>
              Speicher dir diese Url um deine Tracks zu synchronisieren:
            </span>

            <CopyInput
              ref={urlRef}
              onClick={copy}
              defaultValue={data.bitlyUrl}
            />
          </>
        )}
      </SyncLeftView>

      <SyncRightView>
        <Dance />
      </SyncRightView>
    </SyncContainer>
  );
};
