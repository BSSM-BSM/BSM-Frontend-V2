'use client';

import type { NextPage } from 'next'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { userState } from '../../store/account.store';
import { getUserInfo } from '../../utils/userUtil';

const OauthPage = () => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const [, setUser] = useRecoilState(userState);
  const router = useRouter();
  const searchParams = useSearchParams();
    const authCode = searchParams.get('code');

  interface LoginRes {
    accessToken: string,
    refreshToken: string
  }

  useEffect(() => {
    if (!authCode) return;
    (async () => {
      const [, error] = await ajax<LoginRes>({
        method: HttpMethod.POST,
        url: `user/oauth/bsm?code=${authCode}`
      });
      if (error) return;

      await getUserInfo(ajax, setUser);
      closeModal('login');
      router.push('/');
    })();
  }, [authCode]);

  return (<></>);
}

export default OauthPage;
