import { HttpMethod } from '../hooks/useAjax';

export const subscribe = async (ajax: Function, showToast: Function) => {

    const registration = await navigator.serviceWorker.ready;
    const subscription = (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BCeveCXwornm1DNHuNAYDpy8MadIa2-i9ykSG2AORLNbGDPo5QALgEiln_pDX71Pnq4O7UM0EJq_8KeMv_rolAU'
    })).toJSON();

    const {endpoint, keys} = subscription;

    ajax({
        url: 'webpush',
        method: HttpMethod.POST,
        payload: {
            endpoint: endpoint,
            auth: keys?.auth,
            p256dh: keys?.p256dh
        },
        callback() {
            showToast('알림 등록이 완료되었습니다');
        }
    });
}
