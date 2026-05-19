'use client';

import { useRouter } from 'next/navigation';
import { useEffect, use } from 'react';
import { useAtom } from 'jotai';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { useModal } from '@/hooks/useModal';
import { userState } from '@/store/account.store';
import { getUserInfo } from '@/utils/userUtil';

const OauthPage = (props: { searchParams: Promise<{ code?: string }> }) => {
  const searchParams = use(props.searchParams);
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const [, setUser] = useAtom(userState);
  const router = useRouter();

  interface LoginRes {
    accessToken: string;
    refreshToken: string;
  }

  useEffect(() => {
    if (!searchParams.code) return;
    (async () => {
      const [, error] = await ajax<LoginRes>({
        method: HttpMethod.POST,
        url: `auth/oauth/bsm?code=${searchParams.code}`
      });
      if (error) return;

      await getUserInfo(ajax, setUser);
      closeModal('login');
      router.push('/');
    })();
  }, [searchParams.code]);

  return <></>;
};

export default OauthPage;
