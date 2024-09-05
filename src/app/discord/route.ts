import { type Handler } from "@/types";
import { NextResponse } from "next/server";

export const GET: Handler = () => {
  return NextResponse.redirect("https://discord.gg/fWaxCu2CNS");
};
