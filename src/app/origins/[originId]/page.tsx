"use client";

import type { NextPage } from "next";
import getOrigin from "../getOrigin";
import { notFound as nextNotFound, useParams } from "next/navigation";
import type { APIFullOrigin } from "@/types";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import palette from "@/styles/vars.module.scss";
import containerStyles from "@/styles/container.module.scss";
import ColorCode from "@/app/_components/ColorCode";

const Origins: NextPage = () => {
  const [origin, setOrigin] = useState<APIFullOrigin>();
  const [notFound, setNotFound] = useState(false);
  const { originId } = useParams();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        const newOrigin = await getOrigin(decodeURIComponent(originId as string));

        setOrigin(newOrigin);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
    })();
  }, [originId]);

  const originImpactMap = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
  };

  if (notFound) {
    return nextNotFound();
  }

  if (!origin) {
    return (
      <div className={containerStyles.textContainer}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={containerStyles.textContainer} style={{ textAlign: "left" }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
        {origin !== undefined && (
          <Image
            src={origin.icon}
            alt={origin.icon.alt}
            style={{ width: "5rem", height: "auto", aspectRatio: 1, imageRendering: "pixelated" }}
          />
        )}
        <p style={{ fontWeight: "bold", fontSize: "2rem", marginLeft: ".5rem" }}>
          <ColorCode>{origin.name}</ColorCode>
        </p>
        <div style={{ flexGrow: 1 }} />
        <div>
          <span style={{ fontWeight: "bold" }}>Impact: </span>
          {originImpactMap[origin.impact ?? 0]}
        </div>
      </div>
      <hr style={{ borderStyle: "solid", borderColor: palette.primary }} />
      <div>
        <p style={{ marginTop: "1rem" }}>
          <ColorCode>{origin.description}</ColorCode>
        </p>
        {origin.powers.map((power) => {
          return (
            <Fragment key={power[0]}>
              <p style={{ marginTop: "1rem", fontWeight: "bold", textDecoration: "underline" }}>
                <ColorCode>{power[0]}</ColorCode>
              </p>
              <p>
                <ColorCode>{power[1]}</ColorCode>
              </p>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Origins;
