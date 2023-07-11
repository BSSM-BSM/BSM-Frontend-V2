'use client';

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { headerOptionState, pageState } from '@/store/common.store';
import { Banner, BannerPos } from '@/components/common/banner';
import { BannerType } from '@/types/banner.type';
import { EditBackgroundImageBox } from '@/components/home/editBackgroundImagePopup';
import { WidgetContainer } from '@/components/home/WidgetContainer';

const Home = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);

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
      </>
      <WidgetContainer />
    </>
  );
};

export default Home;
