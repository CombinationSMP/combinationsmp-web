import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { type Admin, type PBRecord } from "./types";

export const pbAuth = atom<{
  model?: PBRecord<Admin>;
  token?: string;
}>({
  key: "pocketbase_auth",
  default: { model: undefined, token: undefined },
  effects: [recoilPersist({ key: "pocketbase_auth" }).persistAtom],
});
