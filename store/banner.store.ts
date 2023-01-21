import axios from "axios";
import { selector } from "recoil";
import { Banner } from "../types/banner.type";

export const bannerState = selector<Banner[]>({
    key: 'banner',
    get: async () => {
        return (await axios.get<Banner[]>('/api/banner')).data
    }
});