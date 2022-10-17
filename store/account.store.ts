import { atom } from "recoil";
import { NoLoginUser, Student, Teacher } from "../types/userType";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";

export const userState = atom<NoLoginUser | Student | Teacher>({
    key: 'user',
    default: {
        isLogin: false
    },
    effects: [localStorageEffect('user', LocalStorageType.json)]
});