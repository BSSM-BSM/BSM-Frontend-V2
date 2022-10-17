import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../hooks/useAjax';
import { useModal } from '../hooks/useModal';
import { userState } from '../store/account.store';
import { Student, Teacher } from '../types/userType';

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
            method: HttpMethod.POST,
            url: `user/oauth/bsm?code=${authCode}`,
            callback() {
                getUserInfo();
            }
        })
    }, [authCode]);

    const getUserInfo = () => {
        ajax<Student | Teacher>({
            method: HttpMethod.GET,
            url: 'user',
            callback(data) {
                data = {...data, isLogin: true};
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                closeModal('login');
                router.push('/');
            }
        })
    }
    
    return (<></>);
}

export default OauthPage;
