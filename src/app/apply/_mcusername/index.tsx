"use client";

import type { ChangeEventHandler, CSSProperties } from "react";
import { useEffect, useState } from "react";
import TextInput from "../../_components/FormItem/text";
import { useDebounce } from "use-debounce";
import type { MCAPIUsernameToUUID } from "@/types";
import getUsername from "./getUsername";
import Image from "next/image";

interface IProps {
  style?: CSSProperties;
  errorMessage?: JSX.Element;
  debouncedChange?: (value: string, valid: boolean) => void;
  disabled?: boolean;
}

const MCUsername: React.FC<IProps> = ({ debouncedChange, errorMessage, style, disabled }) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 500);
  const [usernameResponse, setUsernameResponse] = useState<MCAPIUsernameToUUID | false>(false);
  const [loadingUsernameResponse, setLoadingUsernameResponse] = useState(false);
  const [valueModified, setValueModified] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    if (debouncedValue) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const res = await getUsername(debouncedValue);

        if (abortController.signal.aborted) {
          return;
        }

        if (debouncedChange) {
          debouncedChange(res === false ? debouncedValue : res.name, res !== false);
        }

        setUsernameResponse(res);
        setLoadingUsernameResponse(false);
      })();
      return;
    }

    setUsernameResponse(false);
    if (debouncedChange) {
      debouncedChange("", false);
    }

    return () => {
      abortController.abort();
    };
  }, [debouncedChange, debouncedValue]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setValueModified(true);
    setLoadingUsernameResponse(true);

    if (evt.target.value === "") {
      setUsernameResponse(false);
      if (debouncedChange) {
        debouncedChange("", false);
      }
    }

    setValue(evt.target.value);
  };

  return (
    <>
      <TextInput
        required
        placeholder="jeb_"
        maxLength={16}
        disabled={disabled}
        props={{ onChange: handleChange }}
        containerStyle={style}
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
          ) : !loadingUsernameResponse && valueModified ? (
            <Image
              src="/assets/invalid.svg"
              alt="Invalid username"
              width={20}
              height={20}
              style={{ width: 20, height: "auto", aspectRatio: 1 }}
            />
          ) : (
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
          )
        }
      />
      {!usernameResponse && valueModified && !loadingUsernameResponse ? (
        <p style={{ color: "#ff5555" }}>
          {errorMessage ?? (
            <>
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
            </>
          )}
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
    </>
  );
};

export default MCUsername;
