import styles from '../styles/home.module.css';
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useModal } from '../hooks/useModal';
import { userState } from '../store/account.store';

const Home: NextPage = () => {
    const [mounted, setMounted] = useState(false);
    const [user] = useRecoilState(userState);
    const { openModal } = useModal();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const userMenuView = () => (
        mounted && (
            user.isLogin
            ?<a className={styles.menu} href='https://auth.bssm.kro.kr/user'>
                <img className={`${styles.icon} ${styles.no_filter} user-profile`} src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                <div>
                    <div className={styles.user_info}>{user.grade}학년 {user.classNo}반 {user.studentNo}번 {user.name}</div>
                    <div className={styles.user_name}>{user.nickname}</div>
                </div>
            </a>
            :<div className={styles.menu} onClick={() => openModal('login')}>
                <img className={styles.icon} src='/icons/person.svg' alt='login' />
                <span>로그인</span>
            </div>
        )
    )

    return (
        <div className='full-screen'>
            <section className={styles.quick_menu_section}>
                <ul className={styles.quick_menu_list}>
                    <li className='user'>
                        {userMenuView()}
                    </li>
                    <li>
                        <a className={styles.menu} href='/meister'>
                            <img className={styles.icon} src='/icons/person.svg' alt='meister'></img>
                            마이스터 인증제 / 상벌점
                        </a>
                    </li>
                    <li>
                        <a className={styles.menu} href='/meal'>
                            <img className={styles.icon} src='/icons/meal.svg' alt='meal'></img>
                            <span>급식</span>
                        </a>
                    </li>
                    <li>
                        <a className={styles.menu} href='/timetable'>
                            <img className={styles.icon} src='/icons/timetable.svg' alt='timetable'></img>
                            시간표
                        </a>
                    </li>
                    <li>
                        <a className={styles.menu} href='/board/anonymous'>
                            <img className={styles.icon} src='/icons/people.svg' alt='anonymous board'></img>
                            익명게시판
                        </a>
                    </li>
                    <li>
                        <a className={styles.menu} href='/board/qna'>
                            <img className={styles.icon} src='/icons/people.svg' alt='Q&A board'></img>
                            질문게시판
                        </a>
                    </li>
                    <li>
                        <a className={styles.menu} href='/board/software'>
                            <img className={styles.icon} src='/icons/people.svg' alt='software board'></img>
                            소프트웨어 게시판
                        </a>
                    </li>
                    <li>
                        <a className={styles.menu} href='/board/embedded'>
                            <img className={styles.icon} src='/icons/people.svg' alt='embedded board'></img>
                            임베디드 게시판
                        </a>
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default Home
