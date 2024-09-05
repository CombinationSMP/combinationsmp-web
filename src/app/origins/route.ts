import { env } from "@/env";
import { type Handler } from "@/types";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

export const GET: Handler = (req) => {
  const redirectUrl = new NextURL(`${env.NEXT_PUBLIC_HOST}/origins/origins:human#origins:human#origins:human`);

  return NextResponse.redirect(redirectUrl);
};
