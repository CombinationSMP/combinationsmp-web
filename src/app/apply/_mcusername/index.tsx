"use client";

import type { ChangeEventHandler } from "react";
import { useEffect, useState } from "react";
import FormItem from "../../_components/FormItem";
import TextInput from "../../_components/FormItem/text";
import { useDebounce } from "use-debounce";
import type { MCAPIUsernameToUUID } from "@/types";
import getUsername from "./getUsername";
import Image from "next/image";
import invalidPfp from "../../../../public/assets/invalid.svg";

interface IProps {
  index: number;
}

const MCUsername: React.FC<IProps> = ({ index }) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 500);
  const [usernameResponse, setUsernameResponse] = useState<MCAPIUsernameToUUID | false>(false);
  const [loadingUsernameResponse, setLoadingUsernameResponse] = useState(false);
  const [valueModified, setValueModified] = useState(false);

  console.log(usernameResponse);

  useEffect(() => {
    const abortController = new AbortController();
    if (debouncedValue) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const res = await getUsername(debouncedValue);

        if (abortController.signal.aborted) {
          return;
        }

        setUsernameResponse(res);
        setLoadingUsernameResponse(false);
      })();
    }

    return () => {
      abortController.abort();
    };
  }, [debouncedValue]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setValueModified(true);
    setLoadingUsernameResponse(true);

    if (evt.target.value === "") {
      setUsernameResponse(false);
    }

    setValue(evt.target.value);
  };

  return (
    <FormItem required question="What is your Minecraft username?" index={index}>
      <TextInput
        required
        placeholder="jeb_"
        maxLength={16}
        props={{ onChange: handleChange }}
        leftAdornment={
          usernameResponse ? (
            <Image
              src={`https://mc-heads.net/avatar/${usernameResponse.id}/8`}
              width={8}
              height={8}
              alt={`${usernameResponse.name}'s skin.`}
              style={{
                width: 20,
                height: "auto",
                aspectRatio: 1,
                imageRendering: "pixelated",
              }}
            />
          ) : loadingUsernameResponse ? (
            <Image
              src={`https://mc-heads.net/avatar/853c80ef-3c37-49fd-aa49-938b674adae6/8`}
              width={8}
              height={8}
              alt={`jeb_'s skin.`}
              style={{
                width: 20,
                height: "auto",
                aspectRatio: 1,
                imageRendering: "pixelated",
                filter: "brightness(0.5)",
              }}
            />
          ) : (
            <Image
              src="/assets/invalid.svg"
              alt="Invalid username"
              width={20}
              height={20}
              style={{ width: 20, height: "auto", aspectRatio: 1 }}
            />
          )
        }
      />
      {!usernameResponse && valueModified && !loadingUsernameResponse ? (
        <p style={{ color: "#ff5555" }}>
          Invalid username! Please double check your
          <br />
          username on the{" "}
          <a
            href="https://www.minecraft.net/en-us/msaprofile/mygames/editprofile#:~:text=Current%20Java%20Profile%20Name:"
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            Minecraft account page
          </a>
          .
        </p>
      ) : (
        <></>
      )}
      <input
        type="text"
        hidden
        name="minecraft"
        required
        value={usernameResponse === false ? "" : usernameResponse.name}
      />
      <input type="text" hidden name="mcuuid" required value={usernameResponse === false ? "" : usernameResponse.id} />
    </FormItem>
  );
};

export default MCUsername;
