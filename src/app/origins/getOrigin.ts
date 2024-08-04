"use server";

import fs from "fs/promises";
import { existsSync, statSync } from "fs";
import type { APIFullOrigin, ImageImport, OriginIcon, StoredOrigin, StoredOriginLang } from "@/types";
import getPower from "./getPower";
import disabled from "@/origins/disabled.json";

const getOrigin = async (originId: string): Promise<APIFullOrigin> => {
  if (disabled.disabled.includes(originId)) {
    throw new Error("Origin is disabled!");
  }

  const splitId = originId.split(":");
  const originMod = splitId.shift();
  const originRootPath = `src/origins/${originMod}/origins/${splitId.join("/")}.json`;
  if (!existsSync(originRootPath)) {
    throw new Error("Origin does not exist!");
  }

  const originRootFile = JSON.parse(await fs.readFile(originRootPath, "utf-8")) as StoredOrigin;

  const langFilePath = `src/origins/${originMod}/lang/en_us.json`;
  const langFile = (
    existsSync(langFilePath) ? JSON.parse(await fs.readFile(langFilePath, "utf-8")) : {}
  ) as StoredOriginLang;

  const iconId = (typeof originRootFile.icon === "string" ? originRootFile.icon : originRootFile.icon.item).replaceAll(
    ":",
    "/"
  );
  const iconInitialPath = `src/origins/_icons/${iconId}`;

  let icon: OriginIcon;

  try {
    if (existsSync(`${iconInitialPath}.webp`)) {
      //Animated
      icon = {
        alt: iconId,
        ...((await import(`@/origins/_icons/${iconId}.webp`)) as ImageImport).default,
      } as OriginIcon;
    } else {
      icon = {
        alt: iconId,
        ...((await import(`@/origins/_icons/${iconId}.png`)) as ImageImport).default,
      } as OriginIcon;
    }
  } catch (err) {
    console.error(err);
    icon = {
      alt: iconId,
      ...((await import(`@/origins/_icons/minecraft/missing_texture_block.png`)) as ImageImport).default,
    } as OriginIcon;
  }

  return {
    name: originRootFile.name ?? langFile[`origin.${originId.replaceAll(":", ".")}.name`] ?? originId,
    icon,
    impact: originRootFile.impact,
    description: originRootFile.description ?? langFile[`origin.${originId.replaceAll(":", ".")}.description`] ?? "",
    powers:
      (originRootFile.powers &&
        (await Promise.all(originRootFile.powers.map(getPower(originMod!, langFile)))).filter(
          (value) => value.length == 2
        )) ??
      [],
  };
};

export default getOrigin;
