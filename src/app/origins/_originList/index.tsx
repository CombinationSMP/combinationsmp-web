"use client";

import { useParams } from "next/navigation";
import containerStyles from "@/styles/container.module.scss";
import { useEffect, useState } from "react";
import { type APIPartialOrigin } from "@/types";
import getOriginsList from "../getOriginsList";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { type UtilLetters } from "@/types";
import SearchOriginList from "./search";
import Image from "next/image";
import ColorCode from "@/app/_components/ColorCode";

type LetterToFirstOriginMap = {
  [key in UtilLetters]?: string;
};

const OriginList: React.FC = () => {
  const [fullOriginsList, setFullOriginsList] = useState<APIPartialOrigin[]>();
  const [originsList, setOriginsList] = useState<APIPartialOrigin[]>();
  const originId = decodeURIComponent(useParams().originId as string);
  const hide = useMediaQuery("(max-width: 850px) matches true");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const originList = await getOriginsList();

      originList.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });

      setFullOriginsList(originList);
      setOriginsList(originList);
    })();
  }, []);

  console.log(fullOriginsList);

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

  const lettersToFirstOriginMap: LetterToFirstOriginMap = {};

  return (
    <div
      className={containerStyles.textContainer}
      style={{
        height: "calc(100vh - 4rem)",
        position: "sticky",
        top: 0,
        width: "400px",
        padding: 0,
        display: "flex",
        flexDirection: "row",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "1rem 1rem 0 1rem",
        }}
      >
        <SearchOriginList fullOriginsList={fullOriginsList} setOriginsList={setOriginsList} />
        <div style={{ height: "100%", width: "100%", overflowY: "auto", marginTop: ".5rem" }}>
          {originsList.length === 0 ? "No Results" : <></>}
          {originsList.map((partialOrigin) => {
            if (lettersToFirstOriginMap[partialOrigin.name[0]!.toLowerCase() as UtilLetters] === undefined) {
              lettersToFirstOriginMap[partialOrigin.name[0]!.toLocaleLowerCase() as UtilLetters] = partialOrigin.id;
            }
            return (
              <Link
                href={`/origins/${partialOrigin.id}`}
                style={{ all: "unset", width: "100%", cursor: "pointer" }}
                key={partialOrigin.id}
                id={partialOrigin.id}
              >
                <div
                  style={{
                    padding: "2rem",
                    margin: ".5rem 0",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "10px",
                    backgroundColor: `rgba(${originId === partialOrigin.id ? "255, 255, 255, 0.2" : "0, 0, 0, 0.2"})`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src={partialOrigin.icon}
                      alt={partialOrigin.icon.alt}
                      style={{ width: "2.5rem", height: "auto", aspectRatio: 1, imageRendering: "pixelated" }}
                    />
                    <div style={{ marginLeft: ".5rem" }}>
                      <p style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                        <ColorCode>{partialOrigin.name}</ColorCode>
                      </p>
                      <p style={{ fontSize: ".75rem", color: "lightgray" }}>{partialOrigin.id}</p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "1rem",
                      lineClamp: 2,
                      WebkitLineClamp: 2,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    <ColorCode>{partialOrigin.description}</ColorCode>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {originsList.length === fullOriginsList?.length ? (
        <div style={{ display: "flex", flexDirection: "column", marginRight: "1rem" }}>
          {Object.getOwnPropertyNames(lettersToFirstOriginMap).map((letter) => {
            return (
              <a href={`#${lettersToFirstOriginMap[letter as UtilLetters]}`} key={letter}>
                <p>{letter.toUpperCase()}</p>
              </a>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OriginList;
