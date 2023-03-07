'use client';

import styles from '../styles/home.module.css';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import Link from 'next/link';
import { headerOptionState, pageState } from '../store/common.store';
import Head from 'next/head';
import { MeisterHomeMenu } from '../components/home/meisterMenu';
import { UserHomeMenu } from '../components/home/userMenu';
import { Notice } from '../components/common/notice';

const Home = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);

  useEffect(() => {
    setHeaderOption({ title: '' });
    setPage({ id: 'home' });
  }, []);

  return (<>
    <Head>
      <title>BSM - 부산소마고 지원 서비스</title>
    </Head>
    {/* <Notice /> */}
    <section className={styles.quick_menu_section}>
      <ul className={`${styles.quick_menu_list} button-wrap`}>
        <li>
          <UserHomeMenu />
        </li>
        <li>
          <MeisterHomeMenu />
        </li>
        <li>
          <Link href='/meal' className={styles.menu}>
            <img className={styles.icon} src='/icons/meal.svg' alt='meal'></img>
            <span>급식</span>
          </Link>
        </li>
        <li>
          <Link href='/timetable' className={styles.menu}>
            <img className={styles.icon} src='/icons/timetable.svg' alt='timetable'></img>
            시간표
          </Link>
        </li>
        <li>
          <Link href='/board/board' className={styles.menu}>
            <img className={styles.icon} src='/icons/people.svg' alt='free board'></img>
            자유 게시판
          </Link>
        </li>
        <li>
          <Link href='/board/student' className={styles.menu}>
            <img className={styles.icon} src='/icons/people.svg' alt='student board'></img>
            학생 게시판
          </Link>
        </li>
        <li>
          <Link href='/board/code' className={styles.menu}>
            <img className={styles.icon} src='/icons/people.svg' alt='code share'></img>
            코드 공유
          </Link>
        </li>
        <li>
          <Link href='/board/notice' className={styles.menu}>
            <img className={styles.icon} src='/icons/people.svg' alt='notice'></img>
            공지사항
          </Link>
        </li>
      </ul>
    </section>
  </>);
}

export default Home;
