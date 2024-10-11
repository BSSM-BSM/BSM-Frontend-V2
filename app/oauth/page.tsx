'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { useModal } from '@/hooks/useModal';
import { userState } from '@/store/account.store';
import { getUserInfo } from '@/utils/userUtil';
import React from 'react';

const OauthPage = ({ searchParams }: { searchParams: { code?: string } }) => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const [, setUser] = useRecoilState(userState);
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
