import { Handler } from "@/types";
import { NextResponse } from "next/server";

export const GET: Handler = (req) => {
  return NextResponse.redirect("https://www.curseforge.com/minecraft/modpacks/combinationsmp");
};
