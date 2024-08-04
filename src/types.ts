import type { StaticImageData } from "next/image";
import type { NextRequest, NextResponse } from "next/server";

export type Layout = React.FC<React.PropsWithChildren>;

export type Handler = (req: NextRequest) => NextResponse | Promise<NextResponse>;

export interface OriginIcon extends StaticImageData {
  alt: string;
}

export interface APIFullOrigin {
  name: string;
  impact: 0 | 1 | 2 | 3;
  icon: OriginIcon;
  description: string;
  powers: [string, string][];
}

export interface APIPartialOrigin {
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
