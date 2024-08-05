import type { NextRequest, NextResponse } from "next/server";

export type Layout = React.FC<React.PropsWithChildren>;

export type Handler = (req: NextRequest) => NextResponse | Promise<NextResponse>;

export enum Collections {
  Apps = "apps",
}

export interface PBApplication {
  accepted: "true" | "false" | "tbd";
  deniedReason?: string;
  name: string;
  age: number;
  discordName?: string;
  discordUsername: string;
  discordId?: string;
  minecraftUsername: string;
  minecraftUuid?: string;
  javaEdition: boolean;
  contentCreator?: string;
  activities: string;
  active: boolean;
  timezone: string;
  whatCanYouBring: string;
  referrer?: string;
  referrerMember?: string;
  discordApplicationMessageId: string;
}
