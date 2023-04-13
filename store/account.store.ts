import { atom } from "recoil";
import { NoLoginUser, Student, Teacher } from "@/types/user.type";

export const userState = atom<NoLoginUser | Student | Teacher>({
  key: 'user',
  default: {
    isLogin: false
  }
});