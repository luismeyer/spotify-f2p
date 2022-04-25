import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useSync } from "../hooks/use-sync";

type SyncParams = {
  id: string;
};

export const SyncPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<SyncParams>();

  if (!id) {
    navigate("/auth");
    return null;
  }

  const { bitlyUrl, count, fetchSync, loading } = useSync();

  useEffect(() => {
    fetchSync(id);
  }, []);

  const hasData = count.current !== undefined && bitlyUrl.current;

  return (
    <div>
      {loading && <span>...loading {id}</span>}

      {!loading && !hasData && <span>Ein Fehler is aufgetreten</span>}

      {!loading && hasData && (
        <div>
          <span>Es wurden {count.current} Songs synchronisiert.</span>
          <span>Speichere: {bitlyUrl.current}</span>
        </div>
      )}
    </div>
  );
};
