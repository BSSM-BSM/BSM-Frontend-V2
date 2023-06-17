import { CSSProperties, ReactNode, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  backgroundImageUrlState,
  customBackgroundOnlyHomeState,
  headerOptionState,
  pageState,
  sideBarState
} from '@/store/common.store';
import Sidebar from '@/components/common/sidebar/sidebar';
import Navbar from '@/components/common/navbar/navbar';
import { LoginBox } from '@/components/common/accountPopup';
import { SettingBox } from '@/components/common/settingPopup';
import Toast from '@/components/common/overlay/toast';
import Alert from '@/components/common/overlay/alert';
import LoadingDim from '@/components/common/overlay/loadingDim';
import { Header } from '@/components/common/header';

export const Main = ({ children }: { children: ReactNode }) => {
  const [sideBar, setSideBar] = useRecoilState(sideBarState);
  const { title, headTitle } = useRecoilValue(headerOptionState);
  const page = useRecoilValue(pageState);
  const backgroundImageUrl = useRecoilValue(backgroundImageUrlState);
  const customBackgroundOnlyHome = useRecoilValue(customBackgroundOnlyHomeState);

  useEffect(() => {
    if (headTitle) {
      document.title = headTitle;
    } else {
      document.title = title ?? '';
    }
  }, [title]);

  useEffect(() => {
    if (customBackgroundOnlyHome && page.id !== 'home') {
      document.documentElement.style.removeProperty('--background-image');
      return;
    }
    document.documentElement.style.setProperty('--background-image', `url(${backgroundImageUrl || process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND_IMAGE_URL})`);
  }, [backgroundImageUrl, customBackgroundOnlyHome]);

  return (
    <div className={`wrap ${sideBar ? 'side_bar_open' : ''}`}>
      <Sidebar />
      <Navbar />
      <main onClick={() => setSideBar(false)}>
        {children}
      </main>
      <>
        <Header />
        <LoginBox />
        <SettingBox />
        <Toast />
        <Alert />
        <LoadingDim />
      </>
    </div>
  );
};
