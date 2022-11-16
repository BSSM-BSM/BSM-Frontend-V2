import { Banner, BannerType } from "../types/bannerType";

export const bannerEffect = () => ({setSelf}: any) => {
    (async () => {
        setSelf(await getBannerList());
    })();
};

const getBannerList = (): Banner[] => {
    return [
        {
            img: 'https://bssm.kro.kr/resource/banner/1',
            ext: 'jpg'
        }
    ]
}