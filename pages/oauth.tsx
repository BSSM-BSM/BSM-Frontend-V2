import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useAjax } from '../hooks/useAjax';
import { useModal } from '../hooks/useModal';
import { User, userState } from '../store/account.store';
import { decodeBase64 } from '../utils/util';

const OauthPage: NextPage = () => {
    const { ajax } = useAjax();
    const { closeModal } = useModal();
    const [, setUser] = useRecoilState(userState);
    const router = useRouter();
    const authCode = router.query.code;
    
    interface LoginRes {
        accessToken: string,
        refreshToken: string
    }

    useEffect(() => {
        authCode && ajax<LoginRes>({
            method: 'post',
            url: `user/oauth/bsm?code=${authCode}`,
            callback: data => {
                const userInfo = JSON.parse(decodeBase64(data.accessToken.split('.')[1])) as User;
                setUser({
                    ...userInfo,
                    isLogin: true
                });
                closeModal('login');
                router.push('/');
            }
        })
    }, [authCode]);
    
    return (<></>)
}

export default OauthPage
