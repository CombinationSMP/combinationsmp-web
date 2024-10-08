import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    WEBHOOK_ID: z.string(),
    WEBHOOK_TOKEN: z.string(),
    POCKETBASE_ADMIN_EMAIL: z.string().email(),
    POCKETBASE_ADMIN_PASSWORD: z.string(),
    SERVER_TAP_HOST: z.string().url(),
    SERVER_TAP_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_HOST: z.string().url(),
    NEXT_PUBLIC_POCKETBASE_HOST: z.string().url(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    WEBHOOK_ID: process.env.WEBHOOK_ID,
    WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    NEXT_PUBLIC_POCKETBASE_HOST: process.env.NEXT_PUBLIC_POCKETBASE_HOST,
    POCKETBASE_ADMIN_EMAIL: process.env.POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD: process.env.POCKETBASE_ADMIN_PASSWORD,
    SERVER_TAP_HOST: process.env.SERVER_TAP_HOST,
    SERVER_TAP_KEY: process.env.SERVER_TAP_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
