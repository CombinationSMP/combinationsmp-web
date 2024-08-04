import { Handler } from "@/types";
import { NextResponse } from "next/server";

export const GET: Handler = () => {
  return new NextResponse("healthy");
};

export const POST: Handler = () => {
  return new NextResponse("This is an example to test automatic deployments");
};
