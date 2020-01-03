import React, { FC } from "react";

type AuthorizedProps = {
  authority?: boolean;
  noMatch?: React.ReactNode;
};

const Authorized: FC<AuthorizedProps> = ({ authority, noMatch, children }) => {
  return authority ? <>{children}</> : <>{noMatch}</>;
};

export default Authorized;
