import styles from '@/styles/common/banner.module.css';
import { useRecoilValueLoadable } from "recoil"
import { bannerState } from "@/store/banner.store"
import { BannerType } from "@/types/banner.type"
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

export const Banner = ({ position, type }: BannerProps) => {
  const bannerList = useRecoilValueLoadable(bannerState);
  const [bannerIdx, setBannerIdx] = useState<number>(0);
  const banner = bannerList.contents?.[bannerIdx];
  const className = `${styles.banner} ${styles[position]} ${styles[type]}`;

  useEffect(() => {
    setBannerIdx(Math.floor(Math.random() * bannerList.contents?.length));
  }, [bannerList]);

  return (
    banner && (
      banner.link
        ? <a
          className={className}
          target='_blank'
          rel='noopener noreferrer'
          href={banner.link}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BANNER_BASE_PATH}/${banner.id}-${type}.${banner.ext}`}
            width={1024}
            height={1024}
            alt='banner'
          />
        </a>
        : <div className={className}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BANNER_BASE_PATH}/${banner.id}-${type}.${banner.ext}`}
            width={1024}
            height={1024}
            alt='banner'
          />
        </div>
    )
  );
}