import styles from '../../styles/common/banner.module.css';
import { useRecoilState } from "recoil"
import { bannerState } from "../../store/banner.store"
import { BannerType } from "../../types/bannerType"
import Image from 'next/future/image';

export enum BannerPos {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}

interface BannerProps {
    position: BannerPos,
    type: BannerType
}

export const Banner = ({position, type}: BannerProps) => {
    const [bannerList] = useRecoilState(bannerState);
    const banner = bannerList[Math.floor(Math.random() * bannerList.length)];

    return (
        banner &&
        // <img className={`${styles.banner} ${styles[position]} ${styles[type]}`} src={`${banner.img}-${type}.${banner.ext}`}>
        //     {/* <Image src={`${banner.img}-${type}.${banner.ext}`} width={1024} height={1024} /> */}
        // </img>
        <div className={`${styles.banner} ${styles[position]} ${styles[type]}`}>
            <Image
                src={`${banner.img}-${type}.${banner.ext}`}
                width={1024}
                height={1024}
            />
        </div>
    );
}