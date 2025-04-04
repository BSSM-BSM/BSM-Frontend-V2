'use client';

import styles from '@/styles/meister/index.module.css';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '@/store/account.store';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import Link from 'next/link';
import { TextInput } from '@/components/common/inputs/textInput';
import { NumberInput } from '@/components/common/inputs/numberInput';
import { headerOptionState, pageState } from '@/store/common.store';
import { UserRole } from '@/types/user.type';
import { Button } from '@/components/common/buttons/button';
import { MeisterInfo } from '@/types/meister.type';
import { Banner, BannerPos } from '@/components/common/banner';
import { BannerType } from '@/types/banner.type';
import React from 'react';

const MeisterPage = ({ searchParams }: { searchParams: { grade?: number; classNo?: number; studentNo?: number } }) => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { ajax } = useAjax();
  const [noPw, setNoPw] = useState(true);
  const [user] = useRecoilState(userState);
  const [grade, setGrade] = useState<number>(0);
  const [classNo, setClassNo] = useState<number>(0);
  const [studentNo, setStudentNo] = useState<number>(0);
  const [pw, setPw] = useState('');
  const [meisterInfo, setMeisterInfo] = useState<MeisterInfo>({
    scoreHtmlContent: '',
    pointHtmlContent: '',
    score: 0,
    positivePoint: 0,
    negativePoint: 0
  });

  useEffect(() => {
    setHeaderOption({ title: '마이스터 점수 및 상벌점 조회', headTitle: '마이스터 역량인증제 - BSM' });
    setPage({ id: 'meister' });
  }, []);

  useEffect(() => {
    if (!user.isLogin || user.role !== UserRole.STUDENT) return;
    setGrade(user.student.grade);
    setClassNo(user.student.classNo);
    setStudentNo(user.student.studentNo);
  }, [user]);

  useEffect(() => {
    if (!searchParams.grade || !searchParams.classNo || !searchParams.studentNo) return;
    setGrade(searchParams.grade);
    setClassNo(searchParams.classNo);
    setStudentNo(searchParams.studentNo);
  }, [searchParams.grade, searchParams.classNo, searchParams.studentNo]);

  const meisterPointPostProcessing = () => {
    document.querySelectorAll('.fas.fa-sad-cry').forEach(item => {
      item?.parentElement?.parentElement?.parentElement?.parentElement?.classList.add(styles.bad);
    });
  };

  useEffect(meisterPointPostProcessing, [meisterInfo]);

  const loadMeisterInfo = async () => {
    const [data, error] = await ajax<MeisterInfo>({
      url: 'meister/detail',
      method: HttpMethod.POST,
      payload: {
        grade,
        classNo,
        studentNo,
        pw: noPw ? '' : pw
      },
      errorCallback() {
        setMeisterInfo({
          scoreHtmlContent: '',
          pointHtmlContent: '',
          score: 0,
          positivePoint: 0,
          negativePoint: 0
        });
      }
    });
    if (error) return;

    setMeisterInfo(data);
    setPw('');
  };

  return (
    <div className="container _100">
      <>
        <Banner position={BannerPos.TOP} type={BannerType.HORIZONTAL} />
      </>
      <div className={styles.form_warp}>
        <form
          className={`${styles.form} cols gap-1`}
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            loadMeisterInfo();
          }}
        >
          <div className="rows gap-05 center">
            <NumberInput
              setCallback={setGrade}
              initial={undefined}
              value={grade}
              min={1}
              max={3}
              required
              placeholder="학년"
            />
            <NumberInput
              setCallback={setClassNo}
              initial={undefined}
              value={classNo}
              min={1}
              max={4}
              required
              placeholder="반"
            />
            <NumberInput
              setCallback={setStudentNo}
              initial={undefined}
              value={studentNo}
              min={1}
              max={20}
              required
              placeholder="번호"
            />
          </div>
          <div className="cols gap-1 center">
            <TextInput
              disabled={noPw}
              type="password"
              setCallback={setPw}
              placeholder="마이스터 인증제 사이트 비밀번호"
              required
            />
            <label className="checkbox center">
              <input type="checkbox" checked={noPw} onChange={e => setNoPw(e.target.checked)} />
              <span>비밀번호 사용 안함</span>
            </label>
          </div>
          {!noPw && <h4>조회하기 위해 마이스터 인증제 사이트 비밀번호가 필요합니다.</h4>}
          <br />
          <div className="rows gap-2 center">
            <Link href="/meister/ranking">
              <Button>랭킹</Button>
            </Link>
            <Button type="submit" className="accent">
              조회
            </Button>
          </div>
        </form>
      </div>
      {meisterInfo.scoreHtmlContent && (
        <div className={styles.result}>
          <h3 className="right">{`상점: ${meisterInfo.positivePoint} 벌점: ${meisterInfo.negativePoint}`}</h3>
          <div className={styles.score} dangerouslySetInnerHTML={{ __html: meisterInfo.scoreHtmlContent }}></div>
          <div className={styles.point} dangerouslySetInnerHTML={{ __html: meisterInfo.pointHtmlContent }}></div>
        </div>
      )}
    </div>
  );
};

export default MeisterPage;
