import PocketBase from "pocketbase";
import { env } from "./env";

const pbAdmin = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_HOST);

export const getPbAdmin = async () => {
  console.log(env.NEXT_PUBLIC_POCKETBASE_HOST, env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PASSWORD);

  if (!pbAdmin.authStore.isAuthRecord) {
    await pbAdmin.admins.authWithPassword(env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PASSWORD);
  }

  return pbAdmin;
};
