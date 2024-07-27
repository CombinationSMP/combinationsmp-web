import { EmbedBuilder, WebhookClient } from "discord.js";
import type { Handler } from "@/types";
import { env } from "@/env";
import { NextResponse } from "next/server";

interface Form {
  name: string;
  age: string;
  discord: string;
  minecraft: string;
  mcjava: string;
  social?: string;
  activities: string;
  active: string;
  sentences: string;
}

//https://discord.com/api/webhooks/1266554549980889109/LzGMPHLUVf4VbBMqWgXjRBiq7EF18sgp6Pvfd4WUsP9YFRQFukJHi1bB08OaztpwZc2b
const client = new WebhookClient({ id: env.WEBHOOK_ID, token: env.WEBHOOK_TOKEN });

export const POST: Handler = async (req) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = await req.formData();

  console.log(form);

  const embed = new EmbedBuilder()
    .setTitle("New Whitelist Application")
    .setColor("#412C46")
    .setFields([
      { name: "1. What is your preferred name?", value: form.get("name")?.toString() ?? "N/A" },
      { name: "2. How old are you?", value: form.get("age")?.toString() ?? "N/A" },
      {
        name: "3. What is your Discord username?",
        value: form.get("discord")?.toString() ?? "N/A",
      },
      {
        name: "4. What is your Minecraft username?",
        value: form.get("minecraft")?.toString() ?? "N/A",
      },
      {
        name: "5. Do you have Minecraft Java Edition?",
        value: form.get("mcjava")?.toString() === "on" ? "Yes" : "No",
      },
      {
        name: "6. If you're a content creator, what platforms would you post the CombinationSMP on?",
        value: form.get("social")?.toString() ?? "N/A",
      },
      {
        name: "7. What activities do you do most in Minecraft?",
        value: form.get("activities")?.toString() ?? "N/A",
      },
      {
        name: "8. Are you able to be active at least once a week?",
        value: form.get("active")?.toString() === "on" ? "Yes" : "No",
      },
      {
        name: "9. What can you bring to our SMP? Please write at least 2 sentences.",
        value: form.get("sentences")?.toString() ?? "N/A",
      },
    ])
    .setTimestamp(Date.now());

  await client.send({ embeds: [embed] });

  const redirectUrl = req.nextUrl.clone();

  redirectUrl.pathname = "/apply/submitted";

  return NextResponse.redirect(redirectUrl);
};
