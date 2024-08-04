import { Handler } from "@/types";
import { NextResponse } from "next/server";

export const GET: Handler = () => {
  return new NextResponse("healthy");
};
