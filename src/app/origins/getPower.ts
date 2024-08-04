"use server";

import type { StoredOriginLang, StoredOriginPower } from "@/types";
import fs from "fs/promises";
import { existsSync } from "fs";

const getPower = (originMod: string, langFile: StoredOriginLang) => {
  return async (powerId: string): Promise<[] | [string, string]> => {
    const powerArr = powerId.split(":");
    const powerMod = powerArr.shift();
    const powerFilename = powerArr.join("/");

    const powerPath = `src/origins/${powerMod}/powers/${powerFilename}.json`;

    if (!existsSync(powerPath)) {
      return [`§cError in ${powerId}`, "§cCould not find file!"];
    }

    const power = JSON.parse(await fs.readFile(powerPath, "utf-8")) as StoredOriginPower;

    if (power.hidden) {
      return [];
    }

    if (originMod !== powerMod) {
      langFile = JSON.parse(await fs.readFile(`src/origins/${powerMod}/lang/en_us.json`, "utf-8")) as StoredOriginLang;
    }

    const name = power.name ?? langFile[`power.${powerId.replaceAll(":", ".")}.name`] ?? powerId;
    const description =
      power.description ?? langFile[`power.${powerId.replaceAll(":", ".")}.description`] ?? "§cNo description found.";

    return [name, description];
  };
};

export default getPower;
