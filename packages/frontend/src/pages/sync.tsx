import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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

  const { bitlyUrl, count, fetchSync, loading } = useSync();

  useEffect(() => {
    fetchSync(id);
  }, []);

  const copy = () => {
    if (!urlRef.current || !bitlyUrl.current) {
      return;
    }

    /* Select the text field */
    urlRef.current.select();
    urlRef.current.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(bitlyUrl.current);
  };

  const hasData = count.current !== undefined && bitlyUrl.current;

  return (
    <SyncContainer>
      <SyncLeftView>
        {loading && <Loader caption={id} />}

        {!loading && !hasData && <span>Ein Fehler is aufgetreten</span>}

        {!loading && hasData && (
          <>
            <SyncTitle>
              Es wurden {count.current} Songs synchronisiert.
            </SyncTitle>
            <span>
              Speicher dir diese Url um deine Tracks zu synchronisieren:
              {}
            </span>
            <CopyInput
              ref={urlRef}
              onClick={copy}
              defaultValue={bitlyUrl.current}
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
