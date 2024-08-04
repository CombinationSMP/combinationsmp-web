"use client";

import { useParams } from "next/navigation";
import containerStyles from "@/styles/container.module.scss";
import { useEffect, useState } from "react";
import { APIPartialOrigin } from "@/types";
import getOriginsList from "../getOriginsList";
import useMediaQuery from "@mui/material/useMediaQuery";

const OriginList: React.FC = () => {
  const [originsList, setOriginsList] = useState<APIPartialOrigin[]>();
  const { originId } = useParams();
  const hide = useMediaQuery("(max-width: 850px) matches true");

  console.log(hide);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      setOriginsList(await getOriginsList());
    })();
  }, []);

  if (originsList === undefined) {
    return (
      <div className={containerStyles.textContainer} style={{ width: "400px" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (hide) {
    return <></>;
  }

  return (
    <div
      className={containerStyles.textContainer}
      style={{ height: "calc(100vh - 4rem)", position: "sticky", top: 0, width: "400px" }}
    >
      adsf
    </div>
  );
};

export default OriginList;
