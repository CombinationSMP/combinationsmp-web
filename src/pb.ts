"use client";

import PocketBase from "pocketbase";
import { env } from "./env";

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_HOST);

export default pb;
