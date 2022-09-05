import { ReactNode } from "react";
import { useRecoilState } from "recoil";
import { alertState, alertTimerState, loadingState, toastCountState, toastState } from "../store/overlay.store";

interface UseOverlay {
    loading: (flag: boolean) => void;
    showToast: (msg: string | ReactNode, time?: number) => Promise<void>;
    showAlert: (msg: string) => void;
}

export const useOverlay = (): UseOverlay => {
    const [, setLoading] = useRecoilState(loadingState);
    const [, setToastList] = useRecoilState(toastState);
    const [toastCount, setToastCount] = useRecoilState(toastCountState);
    const [, setAlert] = useRecoilState(alertState);
    const [alertTimer, setAlertTimer] = useRecoilState(alertTimerState);

    const loading = (flag: boolean) => {
        setLoading(() => flag);
    }

    const showToast = async (content: string | ReactNode, time: number = 5000) => {
        let index = toastCount;
        setToastCount(prev => ++prev);

        setToastList(prev => {
            return {...prev, [index]: {
                id: index,
                status: 'active',
                content
            }}
        });
        await new Promise((resolve) => setTimeout(() => {resolve(true)}, time));
        setToastList(prev => {
            return {
                ...prev,
                [index]: {
                    ...prev[index],
                    status: 'hide'
                }
            };
        });
        await new Promise((resolve) => setTimeout(() => {resolve(true)}, 200));
        setToastList(prev => {
            const {[index]: exclude, ...list} = prev;
            return list;
        });
    }

    const showAlert = (msg: string) => {
        if (alertTimer.hideTimer) {
            clearInterval(alertTimer.hideTimer);
        }
        if (alertTimer.removeTimer) {
            clearInterval(alertTimer.removeTimer);
        }

        setAlert({
            status: 'active',
            msg
        });

        setAlertTimer({
            hideTimer: setTimeout(() => {
                setAlert(prev => ({
                    ...prev,
                    status: 'hide'
                }));
            }, 5000),
            removeTimer: setTimeout(() => {
                setAlert(() => ({
                    status: '',
                    msg: null
                }));
            }, 5200),
        })
    }

    return {
        loading,
        showToast,
        showAlert
    }
}