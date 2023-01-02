import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import ModalDim from '../components/common/modalDim'
import LoadingDim from '../components/common/overlay/loadingDim'
import Toast from '../components/common/overlay/toast'
import Alert from '../components/common/overlay/alert'
import { LoginBox } from '../components/common/accountPopup'
import { Header } from '../components/common/header'
import { SettingBox } from '../components/common/settingPopup'
import { useEffect } from 'react'
import Script from 'next/script'
import Sidebar from '../components/common/sidebar/sidebar'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");
      });
    }
  }, []);

  return (<>
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
    />
    <Script
      id="gtag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
          page_path: window.location.pathname,
          });
        `,
      }}
    />
    <div className='wrap'>
      <RecoilRoot>
        <Sidebar />
        <main className='scroll-bar'>
          <Component {...pageProps} />
        </main>
        <>
          <Header />
          <LoginBox />
          <SettingBox />
          <Toast />
          <Alert />
          <LoadingDim />
          <ModalDim />
        </>
      </RecoilRoot>
    </div>
  </>);
}

export default MyApp
