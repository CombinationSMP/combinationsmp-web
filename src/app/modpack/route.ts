import { type Handler } from "@/types";
import { NextResponse } from "next/server";

export const GET: Handler = () => {
  return NextResponse.redirect("https://www.curseforge.com/minecraft/modpacks/combinationsmp");
};
