import { NoLoginUser, Student, Teacher } from "@/types/user.type";
import { atomWithReset } from "jotai/utils";

export const userState = atomWithReset<NoLoginUser | Student | Teacher>({
  isLogin: false
});