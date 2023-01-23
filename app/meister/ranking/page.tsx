'use client';

import styles from '../../../styles/meister/ranking.module.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { MeisterRanking } from '../../../types/meister.type';
import { MeisterRankingItem } from '../../../components/meister/rankingItem';
import { useOverlay } from '../../../hooks/useOverlay';
import { headerOptionState, pageState } from '../../../store/common.store';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CheckList } from '../../../components/common/buttons/checkList';
import { userState } from '../../../store/account.store';
import { UserRole } from '../../../types/user.type';
import { Banner, BannerPos } from '../../../components/common/banner';
import { BannerType } from '../../../types/banner.type';

const MeisterPage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { ajax } = useAjax();
  const { showAlert, showToast } = useOverlay();
  const [rankingList, setRankingList] = useState<MeisterRanking[]>([]);
  const [user] = useRecoilState(userState);
  const [grade, setGrade] = useState<number>(0);
  
  useEffect(() => {
    setHeaderOption({ title: '마이스터 랭킹', allMenu: { goBack: true } });
    setPage({id: 'meister'});
  }, []);

  useEffect(() => {
    if (!user.isLogin || user.role !== UserRole.STUDENT) {
      setGrade(1);
      return;
    }
    setGrade(user.student.grade);
  }, [user]);

  useEffect(() => {
    if (!grade) return;
    loadMeisterInfo();
  }, [grade]);

  const loadMeisterInfo = async () => {
    const [data, error] = await ajax<MeisterRanking[]>({
      url: `meister/ranking/${grade}`,
      method: HttpMethod.GET,
      errorCallback(data) {
        if (data && 'statusCode' in data && data.statusCode === 403) {
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
    if (error) return;

    setRankingList(data);
  }

  const updatePrivateRanking = async (flag: boolean) => {
    if (!confirm('설정을 변경하면 하루동안 다시 변경 할 수 없습니다!\n 정말 변경하시겠습니까?')) return;
    const [, error] = await ajax({
      method: HttpMethod.PUT,
      url: 'meister/privateRanking',
      payload: {
        privateRanking: flag
      },
      errorCallback(data) {
        if (data && 'statusCode' in data && data.statusCode === 403) {
          let availableTime = new Date();
          const initHour = -32400000;
          availableTime.setTime(initHour + (Number(data.message) * 1000));
          showAlert(`랭킹 공유 변경 가능 시간까지 ${availableTime.toLocaleTimeString('ko-KR', { hourCycle: 'h23', timeStyle: 'medium' })}`)
          return true;
        }
      },
    });
    if (error) return;

    loadMeisterInfo();
  }

  return (
    <div className='container _100'>
      <Head>
        <title>마이스터 랭킹 - BSM</title>
      </Head>
      <>
        <Banner position={BannerPos.RIGHT} type={BannerType.VERTICAL} />
      </>
      <CheckList
        currentItem={grade}
        itemList={[
          { id: 1, name: '1학년' },
          { id: 2, name: '2학년' },
          { id: 3, name: '3학년' },
        ]}
        callback={item => setGrade(item.id)}
      />
      <ul className={styles.ranking_list}>{
        rankingList.map((ranking, i) => <MeisterRankingItem key={i} ranking={ranking} i={i} updatePrivateRanking={updatePrivateRanking} />)
      }</ul>
    </div>
  );
}

export default MeisterPage;