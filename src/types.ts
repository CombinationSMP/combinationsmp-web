import type { NextRequest, NextResponse } from "next/server";

export type Layout = React.FC<React.PropsWithChildren>;

export type Handler = (req: NextRequest) => NextResponse | Response | Promise<NextResponse | Response>;

export enum Collections {
  Admins = "admins",
  AdminCreationCodes = "admin_creation_codes",
  Apps = "apps",
}

export type PBRecord<T> = T & {
  id: string;
  created: string;
  updated: string;
};

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
}

export interface MCAPIUsernameToUUID {
  name: string;
  id: string;
  legacy?: boolean;
  demo?: boolean;
}

export interface Admin {
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
}

export interface AdminCreationCode {
  used: boolean;
}
