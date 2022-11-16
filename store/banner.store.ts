import { atom } from "recoil";
import { Banner } from "../types/bannerType";
import { bannerEffect } from "../utils/bannerUtil";

export const bannerState = atom<Banner[]>({
    key: 'banner',
    default: [],
    effects: [bannerEffect()]
});