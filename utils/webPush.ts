import { SetterOrUpdater } from 'recoil';
import { Ajax, HttpMethod } from '@/hooks/useAjax';
import { ShowToast } from '@/hooks/useOverlay';

export const webPushEffect =
  () =>
  ({ setSelf }: any) => {
    (async () => {
      setSelf(await getPushSubscription());
    })();
  };

export enum PushPermission {
  PROMPT = 'prompt',
  DENIED = 'denied',
  GRANTED = 'granted'
}

export const getPushPermission = async (): Promise<PushPermission> => {
  const navigator = typeof window !== 'undefined' ? window.navigator : null;
  if (!navigator) return PushPermission.PROMPT;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.permissionState({
    userVisibleOnly: true
  }) as Promise<PushPermission>;
};

export const getPushSubscription = async (): Promise<PushSubscription | null> => {
  const navigator = typeof window !== 'undefined' ? window.navigator : null;
  if (!navigator) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
};

export const subscribe = async (
  ajax: Ajax,
  setPushPermission: SetterOrUpdater<PushSubscription | null>,
  showToast: ShowToast
) => {
  const [, loginError] = await ajax({
    url: 'user',
    method: HttpMethod.GET
  });
  if (loginError) return;

  try {
    await subscribeRequest(ajax, showToast);
  } catch (error) {}
  const state = await getPushPermission();
  switch (state) {
    case PushPermission.PROMPT:
      return showToast('알림을 활성화하는데 문제가 발생하였습니다');
    case PushPermission.DENIED:
      return showToast('알림이 차단되어있습니다\n브라우저 설정에서 수동으로 해제해주세요', 10000);
  }
  setPushPermission(await getPushSubscription());
};

export const unsubscribe = async (
  ajax: Ajax,
  setPushPermission: SetterOrUpdater<PushSubscription | null>,
  showToast: ShowToast
) => {
  const subscription = await getPushSubscription();
  if (!subscription?.endpoint) return showToast('알림 취소에 문제가 발생하였습니다');
  if (!subscription.unsubscribe()) return showToast('알림 취소에 문제가 발생하였습니다');

  const [, error] = await ajax({
    url: `webpush`,
    method: HttpMethod.DELETE,
    config: {
      headers: {
        endpoint: subscription.endpoint
      }
    }
  });
  if (error) showToast('알림 취소에 문제가 발생하였습니다');

  setPushPermission(await getPushSubscription());
};

const subscribeRequest = async (ajax: Ajax, showToast: ShowToast) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = (
    await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BCeveCXwornm1DNHuNAYDpy8MadIa2-i9ykSG2AORLNbGDPo5QALgEiln_pDX71Pnq4O7UM0EJq_8KeMv_rolAU'
    })
  ).toJSON();

  const { endpoint, keys } = subscription;

  const [, error] = await ajax({
    url: 'webpush',
    method: HttpMethod.POST,
    payload: {
      endpoint: endpoint,
      auth: keys?.auth,
      p256dh: keys?.p256dh
    }
  });
  if (error) return;

  showToast('알림 등록이 완료되었습니다');
};
