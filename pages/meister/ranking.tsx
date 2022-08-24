import styles from '../../styles/meister/ranking.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAjax } from '../../hooks/useAjax';

interface MeisterRanking {
    score: number;
    positivePoint: number;
    negativePoint: number;
    student: {
        grade: number,
        classNo: number,
        studentNo: number,
        name: string
    };
    loginError: boolean;
    lastUpdate: string;
}

const MeisterPage: NextPage = () => {
    const { ajax } = useAjax();
    const [rankingList, setRankingList] = useState<MeisterRanking[]>([]);

    useEffect(() => {
        loadMeisterInfo();
    }, []);

    const loadMeisterInfo = () => {
        ajax<MeisterRanking[]>({
            url: 'meister/ranking',
            method: 'get',
            callback(data) {
                setRankingList(data);
            }
        });
    }

    return (
        <div className='container _100'>
            <Head>
                <title>마이스터 랭킹 - BSM</title>
            </Head>
            <div className='title center'>
                <h1>마이스터 랭킹</h1>
            </div>
            <br /><br /><br />
            <ul className={styles.ranking_list}>{
                rankingList.map((ranking, i) => (
                    <li key={i}>
                        <span className={styles.rank}>{i + 1}</span>
                        <span className={styles.student_info}>
                            <span>
                                {`${ranking.student.grade}${ranking.student.classNo}${String(ranking.student.studentNo).padStart(2, '0')}`}
                            </span>
                            <span>{ranking.student.name}</span>
                        </span>
                        {
                            ranking.loginError
                            ?<span className='center'>정보를 자동으로 불러올 수 없습니다</span>
                            :<>
                                <div className={styles.score_info}>
                                    <span>{ranking.score}</span>
                                    <span>{ranking.positivePoint}</span>
                                    <span>{ranking.negativePoint}</span>
                                </div>
                                <span className={styles.last_update}>Update: {new Date(ranking.lastUpdate).toLocaleTimeString('ko-KR', {hour12: false, timeStyle: 'medium'})}</span>
                            </>
                        }
                    </li>
                ))
            }</ul>
        </div>
    );
}

export default MeisterPage;