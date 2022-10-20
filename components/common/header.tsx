import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';
import { userState } from '../../store/account.store';
import { DropdownMenuOption, headerOptionState } from '../../store/common.store';
import styles from '../../styles/header.module.css';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';
import { getProfileSrc } from '../../utils/util';
import { getUserInfo } from '../../utils/userUtil';

export const Header = () => {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { openModal } = useModal();
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const [user, setUser] = useRecoilState(userState);
    const resetUser = useResetRecoilState(userState);
    const [sideBar, setSideBar] = useState(false);
    const [headerOption] = useRecoilState(headerOptionState);
    const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => setSideBar(false));
        setMounted(true);
        getUserInfo(ajax, setUser);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        setProfileSrc(getProfileSrc(user.isLogin? user.code: 0));
    }, [user]);

    const logout = async () => {
        const [, error] = await ajax({
            method: HttpMethod.DELETE,
            url: 'user/logout',
        });
        if (error) return;

        resetUser();
        showToast('로그아웃 되었습니다');
    }

    const userMenuView = () => (
        mounted && (
            user.isLogin
            ? <div className={`dropdown-menu ${styles.dropdown}`}>
                <span className={`${styles.item} ${styles.user_profile_wrap}`}>
                    <span>{user.nickname}</span>
                    <div className='user-profile'>
                        <Image
                            src={profileSrc}
                            onError={() => setProfileSrc(DefaultProfilePic)}
                            width='128px'
                            height='128px'
                            alt='user profile'
                        />
                    </div>
                </span>
                <ul className='dropdown-content'>
                    <li><a href='https://auth.bssm.kro.kr/user' className='option'>유저 정보</a></li>
                    <li><span onClick={() => {logout(); setSideBar(false);}} className='option'>로그아웃</span></li>
                </ul>
            </div>
            : <span className={styles.item} onClick={() => {openModal('login'); setSideBar(false);}}>로그인</span>
        )
    );

    const allMenuFunc = (): {
        className: string,
        func: () => void
    } => {
        const {allMenu} = headerOption;
        if (allMenu?.goBack) {
            return {
                className: 'go-back',
                func: () => router.back()
            };
        }
        return {
            className: '',
            func: () => setSideBar(true)
        };
    }

    const allMenuView = () => {
        if (headerOption.allMenu?.dropdownMenu) {
            return dropdownMenuView(headerOption.allMenu.dropdownMenu);
        }

        const {className, func} = allMenuFunc();
        return (
            <li
                className={`${styles.item} ${styles.all_menu} menu-button ${className}`}
                onClick={func}
            >
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
            </li>
        );
    };

    const optionMenuView = () => {
        if (headerOption.optionMenu?.dropdownMenu) {
            return dropdownMenuView(headerOption.optionMenu.dropdownMenu);
        }
        return <li onClick={() => openModal('setting')} className={`${styles.item} ${styles.setting}`}><img src="/icons/setting.svg" alt="setting" /></li>;
    }

    const dropdownMenuView = (dropdownMenu: DropdownMenuOption[]) => (
        <li className={`dropdown-menu ${styles.dropdown}`}>
            <span className={`${styles.item} ${styles.all_menu} menu-button`}>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
            </span>
            <ul className='dropdown-content'>
                {dropdownMenu.map(
                    menu => <li key={menu.text} onClick={menu.callback}><span className='option'>{menu.text}</span></li>
                )}
            </ul>
        </li>
    );

    return (
        <header className={styles.header}>
            <div className={styles.top}>
                <nav className={styles.top_menu_bar}>
                    <ul className={styles.left}>
                        <li className={styles.home}>
                            <Link href='/'><a className={`${styles.item} ${styles.home}`}>BSM</a></Link>
                        </li>
                        {allMenuView()}
                        <h2 className={styles.title}>
                            {headerOption.title}
                        </h2>
                        {optionMenuView()}
                    </ul>
                    <h2 className={styles.title}>
                        {headerOption.title}
                    </h2>
                    <ul className={styles.right}>
                        <li className={`dropdown-menu ${styles.dropdown}`}>
                            <span className={styles.item}>학교</span>
                            <ul className='dropdown-content'>
                                <li><Link href='/meal'><a className='option'>급식</a></Link></li>
                                <li><Link href='/timetable'><a className='option'>시간표</a></Link></li>
                                <li><Link href='/meister'><a className='option'>점수 / 상벌점</a></Link></li>
                                <li><a href='https://school.busanedu.net/bssm-h/main.do' className='option'>학교 홈페이지</a></li>
                            </ul>
                        </li>
                        <li className={`dropdown-menu ${styles.dropdown}`}>
                            <span className={styles.item}>커뮤니티</span>
                            <ul className='dropdown-content'>
                                <li><Link href='/board/board'><a className='option'>자유 게시판</a></Link></li>
                                <li><Link href='/board/student'><a className='option'>학생 게시판</a></Link></li>
                                <li><Link href='/board/software'><a className='option'>소프트웨어</a></Link></li>
                                <li><Link href='/board/notice'><a className='option'>공지사항</a></Link></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={`${styles.side} ${sideBar? styles.on: ''}`}>
                <div className={`close_button ${styles.close_button}`} onClick={() => setSideBar(false)}></div>
                <div className={`dim ${styles.dim}`} onClick={() => setSideBar(false)}></div>
                <ul className={styles.menus}>
                    <li><Link href='/'><a className={`${styles.item} ${styles.home}`}>BSM</a></Link></li>
                    <li>{userMenuView()}</li>
                    <li><Link href='/timetable'><a className={styles.item}>시간표</a></Link></li>
                    <li><Link href='/meal'><a className={styles.item}>급식</a></Link></li>
                    <li><Link href='/meister'><a className={styles.item}>점수 / 상벌점</a></Link></li>
                    <li className={`dropdown-menu ${styles.dropdown}`}>
                        <span className={styles.item}>커뮤니티</span>
                        <ul className='dropdown-content'>
                            <li><Link href='/board/board'><a className='option'>자유 게시판</a></Link></li>
                            <li><Link href='/board/student'><a className='option'>학생 게시판</a></Link></li>
                            <li><Link href='/board/software'><a className='option'>소프트웨어</a></Link></li>
                            <li><Link href='/board/notice'><a className='option'>공지사항</a></Link></li>
                        </ul>
                    </li>
                    <li className={`dropdown-menu ${styles.dropdown}`}>
                        <span className={styles.item}>다른 서비스</span>
                        <ul className='dropdown-content'>
                            <li><a href='https://auth.bssm.kro.kr' className='option'>BSM Auth</a></li>
                            <li><a href='https://drive.bssm.kro.kr' className='option'>BSM Cloud</a></li>
                            <li><a href='https://tetris.bssm.kro.kr' className='option'>BSM Tetris</a></li>
                        </ul>
                    </li>
                    <li><a className={styles.item} href='https://school.busanedu.net/bssm-h/main.do'>학교 홈페이지</a></li>
                    <li><a className={styles.item} href='https://github.com/BSSM-BSM'>깃허브</a></li>
                </ul>
            </div>
        </header>
    )
}