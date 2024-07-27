import type { NextRequest, NextResponse } from "next/server";

export type Layout = React.FC<React.PropsWithChildren>;

export type Handler = (req: NextRequest) => NextResponse | Promise<NextResponse>;
