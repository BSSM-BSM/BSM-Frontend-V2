import styles from '../../styles/meister/ranking.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAjax } from '../../hooks/useAjax';
import { elapsedTime } from '../../utils/util';
import { MeisterRanking } from '../../types/meisterType';
import { MeisterRankingItem } from './rankingItem';

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
                rankingList.map((ranking, i) => <MeisterRankingItem key={i} ranking={ranking} i={i} />)
            }</ul>
        </div>
    );
}

export default MeisterPage;