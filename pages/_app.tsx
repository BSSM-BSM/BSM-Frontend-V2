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

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js");
            });
        }
    }, []);

    return (
        <RecoilRoot>
            <Component {...pageProps} />
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
    )
}

export default MyApp
