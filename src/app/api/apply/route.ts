import { EmbedBuilder, WebhookClient } from "discord.js";
import type { PBApplication, Handler } from "@/types";
import { Collections } from "@/types";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { getPbAdmin } from "@/pb-admin";

//https://discord.com/api/webhooks/1266554549980889109/LzGMPHLUVf4VbBMqWgXjRBiq7EF18sgp6Pvfd4WUsP9YFRQFukJHi1bB08OaztpwZc2b
const client = new WebhookClient({ id: env.WEBHOOK_ID, token: env.WEBHOOK_TOKEN });

export const POST: Handler = async (req) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = await req.formData();

  console.log(form);

  const application: PBApplication = {
    accepted: "tbd",
    name: form.get("name")?.toString() ?? "N/A",
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    age: parseInt(form.get("age")?.toString() || "32204"),
    discordUsername: form.get("discord")?.toString() ?? "N/A",
    minecraftUsername: form.get("minecraft")?.toString() ?? "N/A",
    javaEdition: form.get("mcjava")?.toString() === "on",
    contentCreator: form.get("social")?.toString?.(),
    activities: form.get("activities")?.toString() ?? "N/A",
    active: form.get("active")?.toString() === "on",
    timezone: form.get("timezone")?.toString() ?? "N/A",
    whatCanYouBring: form.get("sentences")?.toString() ?? "N/A",
    referrer: form.get("referral")?.toString?.(),
    discordApplicationMessageId: "",
  };

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
        name: "6. If you're a content creator, what platforms would you post the CombinationSMP on? (Please provide links)",
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        value: form.get("social")?.toString() || "N/A",
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
        name: "9. What timezone are you in?",
        value: form.get("timezone")?.toString() ?? "N/A",
      },
      {
        name: "10. What can you bring to our SMP? Please write at least 2 sentences.",
        value: form.get("sentences")?.toString() ?? "N/A",
      },
      {
        name: "11. How'd you hear about us?",
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        value: form.get("referral")?.toString() || "N/A",
      },
    ])
    .setTimestamp(Date.now());

  const message = await client.send({ embeds: [embed] });

  application.discordApplicationMessageId = message.id;

  const pb = await getPbAdmin();

  await pb.collection(Collections.Apps).create<PBApplication>(application);

  let redirectUrl: NextURL;

  if (env.NODE_ENV === "production") {
    redirectUrl = new NextURL(`https://${env.NEXT_PUBLIC_HOST}/apply/submitted`);
  } else {
    redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/apply/submitted";
  }

  return NextResponse.redirect(redirectUrl);
};
