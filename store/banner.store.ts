import { atom } from "jotai";
import { Banner } from "@/types/banner.type";

export const bannerState = atom<Banner[]>([]);
