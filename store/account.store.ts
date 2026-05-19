import { atom } from "jotai";
import { NoLoginUser, Student, Teacher } from "@/types/user.type";

export const userState = atom<NoLoginUser | Student | Teacher>({
  isLogin: false
});