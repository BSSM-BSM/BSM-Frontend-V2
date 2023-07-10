'use client';

import styles from '@/styles/home.module.css';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { headerOptionState, pageState } from '@/store/common.store';
import { MeisterHomeMenu } from '@/components/home/meisterMenu';
import { UserHomeMenu } from '@/components/home/userMenu';
import { Banner, BannerPos } from '@/components/common/banner';
import { BannerType } from '@/types/banner.type';
import { EditBackgroundImageBox } from '@/components/home/editBackgroundImagePopup';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { useModal } from '@/hooks/useModal';
import * as S from '@/styles/home.style';

const Home = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { openModal } = useModal();

  useEffect(() => {
    setHeaderOption({ headTitle: 'BSM - 부산소마고 지원 서비스' });
    setPage({ id: 'home' });
  }, []);

  return (
    <>
      <>
        {/* <Notice /> */}
        <Banner position={BannerPos.TOP} type={BannerType.HORIZONTAL} />
        <EditBackgroundImageBox />
        <HiOutlinePencilAlt
          size="2rem"
          className={styles.edit_background_image}
          onClick={() => openModal('edit-background-image')}
        />
      </>
      <S.MenuWrap>
        <UserHomeMenu />
        <MeisterHomeMenu />
      </S.MenuWrap>
    </>
  );
};

export default Home;
