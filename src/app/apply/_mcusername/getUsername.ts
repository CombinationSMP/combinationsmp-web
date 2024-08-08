"use server";

import type { MCAPIUsernameToUUID } from "@/types";
import axios from "axios";

const getUsername = async (username: string): Promise<MCAPIUsernameToUUID | false> => {
  try {
    const res = await axios.get<MCAPIUsernameToUUID>(
      `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`
    );

    if (res.data.demo) {
      return false;
    }

    return res.data;
  } catch {
    return false;
  }
};

export default getUsername;
