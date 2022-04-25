import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

type SyncParams = {
  id: string;
};

export const SyncPage: React.FC = () => {
  let { id } = useParams<SyncParams>();

  return (
    <div>
      Sync PAGE <Link to="/auth">auth</Link>
      {id}
    </div>
  );
};
