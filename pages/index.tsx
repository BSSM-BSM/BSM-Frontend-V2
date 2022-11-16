import styles from '../styles/home.module.css';
import type { NextPage } from 'next'
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Link from 'next/link';
import { headerOptionState } from '../store/common.store';
import Head from 'next/head';
import { MeisterHomeMenu } from '../components/home/meisterMenu';
import { UserHomeMenu } from '../components/home/userMenu';
import { Banner, BannerPos } from '../components/common/banner';
import { BannerType } from '../types/bannerType';

const Home: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);

    useEffect(() => {
        setHeaderOption({title: ''});
    }, []);

    return (
        <div className='full-screen'>
            <Head>
                <title>BSM - 부산소마고 지원 서비스</title>
            </Head>
            <>
                <Banner position={BannerPos.TOP} type={BannerType.HORIZONTAL} />
                <Banner position={BannerPos.LEFT} type={BannerType.VERTICAL} />
                <Banner position={BannerPos.RIGHT} type={BannerType.VERTICAL} />
            </>
            <section className={styles.quick_menu_section}>
                <ul className={`${styles.quick_menu_list} button-wrap`}>
                    <li>
                        <UserHomeMenu />
                    </li>
                    <li>
                        <MeisterHomeMenu />
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
                        <Link href='/board/board'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='free board'></img>
                                자유 게시판
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/board/student'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='student board'></img>
                                학생 게시판
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
                        <Link href='/board/notice'>
                            <a className={styles.menu}>
                                <img className={styles.icon} src='/icons/people.svg' alt='notice'></img>
                                공지사항
                            </a>
                        </Link>
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default Home;
