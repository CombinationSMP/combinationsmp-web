import type { StaticImageData } from "next/image";
import type { NextRequest, NextResponse } from "next/server";

export type Layout = React.FC<React.PropsWithChildren>;

export type Handler = (req: NextRequest) => NextResponse | Promise<NextResponse>;

export interface OriginIcon extends StaticImageData {
  alt: string;
}

export interface APIFullOrigin {
  id: string;
  name: string;
  impact: 0 | 1 | 2 | 3;
  icon: OriginIcon;
  description: string;
  powers: [string, string][];
}

export interface APIPartialOrigin {
  id: string;
  name: string;
  icon: OriginIcon;
  description: string;
}

export interface StoredOrigin {
  powers: string[];
  icon:
    | string
    | {
        item: string;
      };
  impact: 0 | 1 | 2 | 3;
  name?: string;
  description?: string;
  order?: number;
}

export interface StoredOriginPower {
  name?: string;
  description?: string;
  hidden?: boolean;
}

export type StoredOriginLang = Record<string, string>;

export type ImageImport = {
  default: StaticImageData;
};

export enum Collections {
  Admins = "admins",
  AdminCreationCodes = "admin_creation_codes",
  Apps = "apps",
  OriginChanges = "origin_changes",
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

export interface PBOriginChange {
  uuid: string;
}

export interface MCAPIUsernameToUUID {
  name: string;
  id: string;
  legacy?: boolean;
  demo?: boolean;
}

export type UtilLetters =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "y"
  | "z";
