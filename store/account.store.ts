import { atom } from "recoil";
import { NoLoginUser, Student, Teacher } from "../types/userType";

export const userState = atom<NoLoginUser | Student | Teacher>({
    key: 'user',
    default: {
        isLogin: false
    }
});