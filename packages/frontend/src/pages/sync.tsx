import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Dance } from "../components/illustrations/dance";
import { Loader } from "../components/loader";
import {
  CopyInput,
  SyncContainer,
  SyncLeftView,
  SyncRightView,
  SyncTitle,
} from "../components/sync";
import { useSync } from "../hooks/use-sync";

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

  const { isLoading, data } = useSync(id);

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

  return (
    <SyncContainer>
      <SyncLeftView>
        {isLoading && <Loader caption={id} />}

        {!isLoading && <span>Ein Fehler is aufgetreten</span>}

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
