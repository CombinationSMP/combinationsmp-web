import { EmbedBuilder, WebhookClient } from "discord.js";
import type { PBApplication, Handler, PBRecord } from "@/types";
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

  const pb = await getPbAdmin();

  const application: PBApplication = {
    accepted: "tbd",
    name: form.get("name")?.toString() ?? "N/A",
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    age: parseInt(form.get("age")?.toString() || "32204"),
    discordUsername: form.get("discord")?.toString() ?? "N/A",
    minecraftUsername: form.get("minecraft")?.toString() ?? "N/A",
    minecraftUuid: form.get("mcuuid")?.toString?.(),
    javaEdition: form.get("mcjava")?.toString() === "on",
    contentCreator: form.get("social")?.toString?.() === "" ? undefined : form.get("social")?.toString?.(),
    activities: form.get("activities")?.toString() ?? "N/A",
    active: form.get("active")?.toString() === "on",
    timezone: form.get("timezone")?.toString() ?? "N/A",
    whatCanYouBring: form.get("sentences")?.toString() ?? "N/A",
    referrer: form.get("referral")?.toString?.() === "" ? undefined : form.get("referral")?.toString?.(),
  };

  console.log(application);

  const pbResponse = await pb.collection(Collections.Apps).create<PBRecord<PBApplication>>(application);

  const embed = new EmbedBuilder()
    .setTitle("New Whitelist Application")
    .setColor("#412C46")
    .setFields([
      { name: "1. What is your preferred name?", value: application.name },
      { name: "2. How old are you?", value: application.age.toString() },
      {
        name: "3. What is your Discord username?",
        value: application.discordUsername,
      },
      {
        name: "4. What is your Minecraft username?",
        value: application.minecraftUsername,
      },
      {
        name: "5. Do you have Minecraft Java Edition?",
        value: application.javaEdition ? "Yes" : "No",
      },
      {
        name: "6. If you're a content creator, what platforms would you post the CombinationSMP on? (Please provide links)",
        value: application.contentCreator ?? "N/A",
      },
      {
        name: "7. What activities do you do most in Minecraft?",
        value: application.activities,
      },
      {
        name: "8. Are you able to be active at least once a week?",
        value: application.active ? "Yes" : "No",
      },
      {
        name: "9. What timezone are you in?",
        value: application.timezone,
      },
      ...(application.whatCanYouBring.length > 1024
        ? [
            {
              name: "10. What can you bring to our SMP? Please write at least 2 sentences.",
              value: application.whatCanYouBring.substring(0, 1024),
            },
            {
              name: "10 contd.",
              value: application.whatCanYouBring.substring(1024),
            },
          ]
        : [
            {
              name: "10. What can you bring to our SMP? Please write at least 2 sentences.",
              value: application.whatCanYouBring,
            },
          ]),
      {
        name: "11. How'd you hear about us?",
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        value: application.referrer ?? "N/A",
      },
    ])
    .setFooter({ text: `Application ID: ${pbResponse.id}` });

  await client.send({ embeds: [embed] });

  let redirectUrl: NextURL;

  if (env.NODE_ENV === "production") {
    redirectUrl = new NextURL(`https://${env.NEXT_PUBLIC_HOST}/apply/submitted`);
  } else {
    redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/apply/submitted";
  }

  return NextResponse.redirect(redirectUrl);
};
