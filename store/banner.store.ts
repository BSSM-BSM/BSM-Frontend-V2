import axios from "axios";
import { atom } from "jotai";
import { Banner } from "@/types/banner.type";

export const bannerState = atom(async () => {
  return (await axios.get<Banner[]>('/api/banner')).data
});