"use server";

import type { APIPartialOrigin } from "@/types";
import fs from "fs/promises";
import { statSync } from "fs";
import getOrigin from "./getOrigin";

const getOriginsList = async (): Promise<APIPartialOrigin[]> => {
  const modsList = await fs.readdir("src/origins");

  const origins: string[] = [];

  for (const mod of modsList) {
    if (!statSync(`src/origins/${mod}`).isDirectory() || mod.startsWith("_")) {
      continue;
    }

    const modOrigins = await fs.readdir(`src/origins/${mod}/origins`);

    for (const origin of modOrigins) {
      origins.push(`${mod}:${origin.replace(".json", "")}`);
    }
  }

  return (
    await Promise.all(
      origins.map(async (originId) => {
        try {
          const origin = await getOrigin(originId);
          return {
            id: originId,
            name: origin.name,
            description: origin.description,
            icon: origin.icon,
          } as APIPartialOrigin;
        } catch (err) {
          console.error(err);
          return undefined;
        }
      })
    )
  ).filter((item) => item !== undefined);
};

export default getOriginsList;
