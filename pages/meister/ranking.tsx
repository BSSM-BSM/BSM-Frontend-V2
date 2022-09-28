import styles from '../../styles/meister/ranking.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ErrorResType, HttpMethod, useAjax } from '../../hooks/useAjax';
import { MeisterRanking } from '../../types/meisterType';
import { MeisterRankingItem } from '../../components/meister/rankingItem';
import { useOverlay } from '../../hooks/useOverlay';
import { headerOptionState } from '../../store/common.store';
import { useRecoilState } from 'recoil';

const MeisterPage: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const { ajax } = useAjax();
    const { showAlert, showToast } = useOverlay();
    const [rankingList, setRankingList] = useState<MeisterRanking[]>([]);

    useEffect(() => {
        setHeaderOption({title: '마이스터 랭킹', allMenu: 'goBack'});
        loadMeisterInfo();
    }, []);

    const loadMeisterInfo = () => {
        ajax<MeisterRanking[]>({
            url: 'meister/ranking',
            method: HttpMethod.GET,
            callback(data) {
                setRankingList(data);
            },
            errorCallback(data) {
                if (data instanceof ErrorResType && data.statusCode === 403) {
                    setRankingList([]);
                    showToast(
                        <p onClick={() => updatePrivateRanking(false)}>
                            랭킹을 공유하고 싶으면<br />
                            여기를 누르세요
                        </p>
                    , 10000);
                }
            },
        });
    }

    const updatePrivateRanking = (flag: boolean) => {
        if (!confirm('설정을 변경하면 하루동안 다시 변경 할 수 없습니다!\n 정말 변경하시겠습니까?')) return;
        ajax({
            method: HttpMethod.PUT,
            url: 'meister/privateRanking',
            payload: {
                privateRanking: flag
            },
            callback() {
                loadMeisterInfo();
            },
            errorCallback(data) {
                if (data instanceof ErrorResType && data.statusCode === 403) {
                    let availableTime = new Date();
                    const initHour = -32400000;
                    availableTime.setTime(initHour + (Number(data.message) * 1000));
                    showAlert(`랭킹 공유 변경 가능 시간까지 ${availableTime.toLocaleTimeString('ko-KR', {hourCycle: 'h23', timeStyle: 'medium'})}`)
                    return true;
                }
            },
        });
    }

    return (
        <div className='container _100'>
            <Head>
                <title>마이스터 랭킹 - BSM</title>
            </Head>
            <ul className={styles.ranking_list}>{
                rankingList.map((ranking, i) => <MeisterRankingItem key={i} ranking={ranking} i={i} updatePrivateRanking={updatePrivateRanking} />)
            }</ul>
        </div>
    );
}

export default MeisterPage;