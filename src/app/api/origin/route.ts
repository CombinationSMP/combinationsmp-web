import axios from "axios";
import { Collections, type PBOriginChange, type PBRecord, type Handler } from "@/types";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { z } from "zod";
import getUsername from "@/app/apply/_mcusername/getUsername";
import { getPbAdmin } from "@/pb-admin";

interface ServerTapError {
  title: string;
  status: number;
  type: string;
  details: Record<string, string | number>;
}

interface PlayerInfo {
  status: undefined;
  uuid: string;
  displayName: string;
  address: string;
  port: number;
  exhaustion: number;
  exp: number;
  whitelisted: boolean;
  banned: boolean;
  op: boolean;
  balance: number;
  location: [number, number, number];
  dimension: string;
  health: number;
  hunger: number;
  saturation: number;
  gamemode: "CREATIVE" | "SURVIVAL" | "ADVENTURE" | "SPECTATOR";
  lastPlayed: number;
}

const getPlayer = async (playerUuid: string) => {
  const res = await axios.get<PlayerInfo | ServerTapError>(
    `${env.SERVER_TAP_HOST}/v1/players/${encodeURIComponent(playerUuid)}`,
    {
      headers: {
        Key: env.SERVER_TAP_KEY,
      },
      validateStatus: () => true,
    }
  );

  return res.data;
};

const sendMessage = async (playerUuid: string, message: string) => {
  const params = new URLSearchParams();
  params.append("playerUuid", playerUuid);
  params.append("message", message);

  const res = await axios.post<"success" | ServerTapError>(`${env.SERVER_TAP_HOST}/v1/chat/tell`, params, {
    headers: {
      "Content-Type": "x-www-form-urlencoded",
      Key: env.SERVER_TAP_KEY,
    },
    validateStatus: () => true,
  });

  return res.data;
};

const sendCommand = async (command: string) => {
  const params = new URLSearchParams();
  params.append("command", command);
  const res = await axios.post<string>(`${env.SERVER_TAP_HOST}/v1/server/exec`, params, {
    headers: {
      "Content-Type": "x-www-form-urlencoded",
      Key: env.SERVER_TAP_KEY,
    },
    validateStatus: () => true,
  });

  return res.data;
};

const Body = z.object({
  username: z.string(),
  originId: z.string(),
});

export const PUT: Handler = async (req) => {
  const { data, success, error } = await Body.safeParseAsync(await req.json());
  if (!success) {
    return NextResponse.json(error);
  }
  const body = {
    username: decodeURIComponent(data.username),
    originId: decodeURIComponent(data.originId),
  };

  const userInfo = await getUsername(body.username);

  if (userInfo === false) {
    return NextResponse.json({
      issues: [
        {
          fatal: true,
          message: "Invalid username! Please double check your username.",
        },
      ],
    });
  }

  // [e,f,5,7,c,0,e,7,-,4,0,9,c,-,4,2,9,2,-,b,8,7,4,-,7,4,2,b,9,2,b,5,a,1,3,0]
  const splitLongUuid = userInfo.id.split("");
  splitLongUuid.splice(8, 0, "-");
  splitLongUuid.splice(13, 0, "-");
  splitLongUuid.splice(18, 0, "-");
  splitLongUuid.splice(23, 0, "-");
  const longUuid = splitLongUuid.join("");
  console.log(longUuid);

  const pb = await getPbAdmin();

  const userOriginChanges = await pb
    .collection(Collections.OriginChanges)
    .getFullList<PBRecord<PBOriginChange>>({ filter: `uuid="${userInfo.id}"` });

  if (userOriginChanges.length >= 5) {
    // Check if any records are older than 30 days
    const oneMonthAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
    for (const originChange of userOriginChanges) {
      const originChangeDate = new Date(originChange.created).getTime();

      if (oneMonthAgo - originChangeDate > 0) {
        // Greater than 30 days ago
        await pb.collection(Collections.OriginChanges).delete(originChange.id);
      }
    }

    const newUserOriginChanges = await pb
      .collection(Collections.OriginChanges)
      .getFullList<PBRecord<PBOriginChange>>({ filter: `uuid="${userInfo.id}"` });

    if (newUserOriginChanges.length >= 5) {
      await sendMessage(
        longUuid,
        `§cFailed to set origin: Origin has been changed more than 5 times in the past month!`
      );
      return NextResponse.json({
        issues: [
          {
            fatal: true,
            message: "Origin has been changed more than 5 times in the past month!",
          },
        ],
      });
    }
  }

  //Check if player is online
  const onlinePlayer = await getPlayer(longUuid);
  console.log(onlinePlayer);
  if (onlinePlayer.status === 404) {
    return NextResponse.json({
      issues: [
        {
          fatal: true,
          message: "Could not find user. Please make sure you are logged into the server!",
        },
      ],
    });
  }
  if (onlinePlayer.status !== undefined) {
    return NextResponse.json({
      issues: [
        {
          fatal: true,
          message: `An unknown ${onlinePlayer.status} error occurred whilst trying to fetch user.`,
        },
      ],
    });
  }

  if (!onlinePlayer.op) {
    // Opped players don't have an origin change limit
    await pb.collection(Collections.OriginChanges).create<PBOriginChange>({
      uuid: userInfo.id,
    } as PBOriginChange);
  }

  await sendCommand(`origin set ${userInfo.name} origins:origin ${body.originId}`);
  await sendMessage(longUuid, `§2Successfully set origin to ${body.originId}!`);

  return NextResponse.json({ success: "true" });
};
