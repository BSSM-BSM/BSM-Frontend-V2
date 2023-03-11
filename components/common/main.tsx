import { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { sideBarState } from '../../store/common.store';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { LoginBox } from './accountPopup';
import { SettingBox } from './settingPopup';
import Toast from './overlay/toast';
import Alert from './overlay/alert';
import LoadingDim from './overlay/loadingDim';
import ModalDim from './modalDim';
import { Header } from './header';

export const Main = ({
  children,
}: {
  children: ReactNode;
}) => {
  const sideBar = useRecoilValue(sideBarState);

  return (
    <div className={`wrap ${sideBar? 'side_bar_open': ''}`}>
      <Sidebar />
      <Navbar />
      <main>{children}</main>
      <>
        <Header />
        <LoginBox />
        <SettingBox />
        <Toast />
        <Alert />
        <LoadingDim />
        <ModalDim />
      </>
    </div>
  );
}