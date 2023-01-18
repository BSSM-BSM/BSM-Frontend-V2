'use client';

import '../styles/globals.css'
import { ReactNode, useEffect } from "react";
import { RecoilRoot } from "recoil";
import { Header } from "../components/common/header";
import { LoginBox } from "../components/common/accountPopup";
import { SettingBox } from "../components/common/settingPopup";
import Toast from "../components/common/overlay/toast";
import Alert from "../components/common/overlay/alert";
import LoadingDim from "../components/common/overlay/loadingDim";
import ModalDim from "../components/common/modalDim";
import StyledComponentsRegistry from '../lib/registry';
import Script from 'next/script';
import Sidebar from '../components/common/sidebar/sidebar';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <html lang="kr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="msapplication-TileColor" content="#1a1a1a"></meta>
        <link rel="apple-touch-icon" href="/icons/app/icon-192x192.png"></link>
        <link href="/icons/app/splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href="/icons/app/splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
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
      </head>
      <body className="dark">
        <div id="modal-wrap" />
        <div id="overlay-wrap" />
        <div className='wrap'>
          <StyledComponentsRegistry>
            <RecoilRoot>
              <Sidebar />
              <main className='scroll-bar'>{children}</main>
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
          </StyledComponentsRegistry>
        </div>
      </body>
    </html>
  );
}