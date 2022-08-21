import styles from '../styles/home.module.css';
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useModal } from '../hooks/useModal';
import { userState } from '../store/account.store';
import { useAjax } from '../hooks/useAjax';
import Modal from '../components/common/modal';
import Link from 'next/link';

interface MeisterInfo {
    isLoading: boolean;
    score?: number;
    positivePoint?: number;
    negativePoint?: number;
    lastUpdate: string;
    uniqNo?: string;
    loginError?: boolean;
    error: string | false;
}

const Home: NextPage = () => {
    const [mounted, setMounted] = useState(false);
    const [user] = useRecoilState(userState);
    const [meisterInfo, setMeisterInfo] = useState<MeisterInfo>({
        isLoading: true,
        lastUpdate: '',
        error: false
    });
    const { openModal } = useModal();
    const { ajax } = useAjax();

    useEffect(() => {
        setMounted(true);
        loadMeisterInfo();
        return () => setMounted(false);
    }, []);

    const loadMeisterInfo = (type?: string) => {
        setMeisterInfo({
            isLoading: true,
            lastUpdate: '',
            error: false
        });
        ajax<MeisterInfo>({
            url: `meister${type === 'update'? '/update': ''}`,
            method: 'get',
            callback(data) {
                setMeisterInfo({
                    ...data,
                    isLoading: false,
                    error: data.loginError? 'login': false
                });
            },
            errorCallback(data) {
                if (data?.statusCode === 401) {
                    setMeisterInfo({
                        isLoading: false,
                        lastUpdate: new Date().toString(),
                        error: 'auth'
                    });
                    return true;
                }
                setMeisterInfo({
                    isLoading: false,
                    lastUpdate: new Date().toString(),
                    error: 'unknown'
                });
                return false;
            },
        })
    }

    const userMenuView = () => (
        mounted && (
            user.isLogin
            ?<a className={styles.menu} href='https://auth.bssm.kro.kr/user'>
                <img className={`${styles.icon} ${styles.user_icon} user-profile`} src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                <div>
                    <div className={styles.sub_content}>{user.grade}학년 {user.classNo}반 {user.studentNo}번 {user.name}</div>
                    <div className={styles.main_content}>{user.nickname}</div>
                </div>
            </a>
            :<div className={styles.menu} onClick={() => openModal('login')}>
                <img className={styles.icon} src='/icons/person.svg' alt='login' />
                <span>로그인</span>
            </div>
        )
    )

    const meisterInfoView = () => {
        const { isLoading, error, score, positivePoint, negativePoint } = meisterInfo;

        if (isLoading) return '로딩중';
        if (error === 'auth') return '로그인후 이용 가능합니다';
        if (error === 'login') return (
            <>
                <span>정보를 자동으로 불러올 수 없습니다</span>
                <span onClick={e => {
                    e.preventDefault();
                    openModal('meister_login_error');
                }}>해결 방법</span>
            </>
        );
        if (error) return '알 수 없는 에러가 발생하였습니다';
        return `${score}점 / 상점: ${positivePoint} 벌점: ${negativePoint}`;
    }

    return (
        <div className='full-screen'>
            <section className={styles.quick_menu_section}>
                <ul className={styles.quick_menu_list}>
                    <li>
                        {userMenuView()}
                    </li>
                    <li>
                        <Link href='/meister'>
                            <a className={`${styles.menu} ${styles.meister}`}>
                                <img className={styles.icon} src='/icons/person.svg' alt='meister'></img>
                                <div>
                                    <div className={styles.sub_content}>
                                        <span>
                                            점수 / 상벌점
                                        </span>
                                        <span className={styles.meister_info} onClick={e => {
                                            e.preventDefault();
                                            loadMeisterInfo('update');
                                        }}>
                                            {!meisterInfo.isLoading && `Update: ${new Date(meisterInfo.lastUpdate).toLocaleTimeString('ko-KR', {hour12: false, timeStyle: 'medium'})}`}
                                            {!meisterInfo.isLoading && <img className={`${styles.icon} ${styles.refresh}`} src='/icons/refresh.svg' alt='refresh'></img>}
                                        </span>
                                    </div>
                                    <div className={styles.main_content}>{meisterInfoView()}</div>
                                </div>
                            </a>
                        </Link>
                    </li>
                    <li>
                       <Link href='/meal'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/meal.svg' alt='meal'></img>
                                <span>급식</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                       <Link href='/timetable'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/timetable.svg' alt='timetable'></img>
                                시간표
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/board/anonymous'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='anonymous board'></img>
                                익명게시판
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/board/qna'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='Q&A board'></img>
                                질문게시판
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/board/software'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='software board'></img>
                                소프트웨어 게시판
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/board/embedded'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='embedded board'></img>
                                임베디드 게시판
                            </a>
                        </Link>
                    </li>
                </ul>
            </section>
            <Modal type="main" id="meister_login_error" title="해결 방법">
                <div>
                    <a href="https://bssm.meistergo.co.kr" className='accent-text'>마이스터 역량 인증제 사이트</a><span>의 비밀번호를 초기 비밀번호로 재설정한 뒤 다시 새로고침 해주세요</span>
                    <br />
                    <br />
                    <details>
                        {meisterInfo.uniqNo}
                        <summary>초기 비밀번호 보기</summary>
                    </details>
                </div>
            </Modal>
        </div>
    )
}

export default Home;
