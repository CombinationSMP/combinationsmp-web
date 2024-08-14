"use client";

import { RecoilRoot } from "recoil";

const RecoilRootClient: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default RecoilRootClient;
