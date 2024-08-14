"use client";

import { pbAuth } from "@/atoms";
import pb from "@/pb";
import { type Admin, type PBRecord } from "@/types";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const PbAuthUpdater: React.FC = () => {
  const [, setAuth] = useRecoilState(pbAuth);

  useEffect(() => {
    const remove = pb.authStore.onChange((token, model) => {
      setAuth({
        token,
        model: model as PBRecord<Admin>,
      });
    });

    return () => {
      remove();
    };
  }, [setAuth]);

  return <></>;
};

export default PbAuthUpdater;
