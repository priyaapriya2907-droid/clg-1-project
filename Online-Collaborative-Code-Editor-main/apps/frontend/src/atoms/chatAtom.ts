import { atom } from "recoil";

interface Message {
  user: string;
  text: string;
  timestamp: string;
}

export const chatAtom = atom<Message[]>({
  key: "chatAtom",
  default: [],
});
