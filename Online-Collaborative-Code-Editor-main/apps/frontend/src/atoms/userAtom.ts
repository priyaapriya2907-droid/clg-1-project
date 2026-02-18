import { atom } from 'recoil';

export type User = {
  id: string;
  name: string;
  roomId: string;
  isAdmin?: boolean;
};

export const userAtom = atom<User >({
  key: 'userAtom',
  default: {id: "", name: "", roomId: "", isAdmin: false},
});