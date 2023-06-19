import { ReactNode, useEffect } from 'react';
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
import Loading from '@/components/common/overlay/loading';
import { Header } from '@/components/common/header';
import { activePageCheck } from '@/utils/page';

const noCustomBackgroundPages: {
  id: string;
  subId?: string;
}[] = [
  { id: 'board' },
  { id: 'board', subId: 'lost-found' },
  { id: 'service' }
];

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
    const noCustomBackground =
      (customBackgroundOnlyHome && page.id !== 'home') ||
      noCustomBackgroundPages.some(page => activePageCheck(page, true));
    if (noCustomBackground) {
      document.documentElement.style.removeProperty('--background-image');
      return;
    }
    document.documentElement.style.setProperty(
      '--background-image',
      `url(${backgroundImageUrl || process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND_IMAGE_URL})`
    );
  }, [page, backgroundImageUrl, customBackgroundOnlyHome]);

  return (
    <div className={`wrap ${sideBar ? 'side_bar_open' : ''}`}>
      <Sidebar />
      <Navbar />
      <main onClick={() => setSideBar(false)}>{children}</main>
      <>
        <Header />
        <LoginBox />
        <SettingBox />
        <Toast />
        <Alert />
        <Loading />
      </>
    </div>
  );
};
