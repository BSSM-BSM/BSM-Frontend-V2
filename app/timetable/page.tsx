'use client';

import styles from '../../styles/timetable/timetable.module.css';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useInterval } from '../../hooks/useInterval';
import { useOverlay } from '../../hooks/useOverlay';
import { numberInBetween } from '../../utils/util';
import { headerOptionState, pageState } from '../../store/common.store';
import { UserRole } from '../../types/user.type';
import { TimetableClassMenu } from '../../components/timetable/timetableClassMenu';
import { Timetable, TimetableDayType, TimetableListRes, TimetableListType } from '../../types/timetable.type';
import { TimetableList } from '../../components/timetable/timetableList';
import { Button } from '../../components/common/buttons/button';
import { dateToShortTimeStr, dayNames, shortTimeStrToTotalSecond } from '../../utils/date';

const TimetablePage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);

  const { ajax } = useAjax();
  const { showAlert } = useOverlay();
  const [user] = useRecoilState(userState);
  const [grade, setGrade] = useState(0);
  const [classNo, setClassNo] = useState(0);
  const [day, setDay] = useState(new Date().getDay());
  const [dayKey, setDayKey] = useState(TimetableDayType.SUN);
  const [timetableList, setTimetableList] = useState<TimetableListType | null>(null);
  const [timetable, setTimetable] = useState<Timetable>([]);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const timetableListRef = useRef<HTMLUListElement>(null);
  const [focus, setFocus] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  useEffect(() => {
    setHeaderOption({ title: '시간표' });
    setPage({ id: 'timetable' });
  }, []);

  useEffect(() => {
    if (!user.isLogin || user.role !== UserRole.STUDENT) {
      setGrade(1);
      setClassNo(1);
      return;
    }
    setGrade(user.student.grade);
    setClassNo(user.student.classNo);
  }, [user]);

  useEffect(() => {
    if (!grade || !classNo) return;

    loadTimetableInfo();
  }, [grade, classNo]);

  useEffect(() => {
    setDayKey(TimetableDayType[day] as unknown as TimetableDayType);
  }, [day]);
  
  useEffect(() => {
    if (!timetableList) return setTimetable([]);;

    if (!timetableList[dayKey]?.length) {
      showAlert('시간표 데이터가 없습니다');
    }
    setTimetable(timetableList[dayKey] ?? []);
    if (day !== new Date().getDay()) {
      setFocus(false);
      setCurrentTimeIndex(-1);
    }
  }, [dayKey, timetableList]);

  const timeTableRender = () => {
    if (!timetable.length) return;

    const newDate = new Date();

    const currentTime = newDate.toLocaleTimeString('ko-KR', { hour12: false, timeStyle: 'medium' });
    if (time == currentTime) return;
    setTime(currentTime);

    if (focus && day !== newDate.getDay()) {
      setDay(newDate.getDay());
    }

    if (day === newDate.getDay()) {
      syncTimetable(newDate);
    }

    setDate(newDate.toLocaleDateString());
  }

  useInterval(timeTableRender, 500);

  useEffect(timeTableRender, [timetable]);
  useEffect(() => {
    timetableListRef.current?.scrollTo({
      left: scrollX
    });
  }, [scrollX]);

  const syncTimetable = (newDate: Date) => {
    let startTotalTime = 0;
    let endTotalTime = 0;
    let currentTotalTime = 0;
    let currentTimeIndex = 0;
    timetable.some((timetable, i) => {
      startTotalTime = shortTimeStrToTotalSecond(timetable.startTime);
      endTotalTime = shortTimeStrToTotalSecond(timetable.endTime);
      currentTotalTime = shortTimeStrToTotalSecond(dateToShortTimeStr(newDate));
      if (numberInBetween(startTotalTime, endTotalTime, currentTotalTime)) {
        currentTimeIndex = i;
        setCurrentTimeIndex(i);
        return true;
      }
    });

    if (focus) {
      const normalElOffset = 350;
      const breaktimeElOffset = 150;
      let totalOffset = 0;

      timetable.some((timetable, i) => {
        if (currentTimeIndex <= i) {
          totalOffset += ((currentTotalTime - startTotalTime) / (endTotalTime - startTotalTime)) * (timetable.type === 'break' ? breaktimeElOffset : normalElOffset);
          return true;
        }
        if (timetable.type === 'break') {
          totalOffset += breaktimeElOffset;
        } else {
          totalOffset += normalElOffset;
        }
      });
      setScrollX(Math.floor(totalOffset));
    }
  }

  const loadTimetableInfo = async () => {
    const [data, error] = await ajax<TimetableListRes>({
      url: `timetable/${grade}/${classNo}`,
      method: HttpMethod.GET,
      errorCallback() {
        setTimetableList(null);
      }
    });
    if (error) return;

    setTimetableList(data.timetableList);
  }

  return (
    <>
      <Head>
        <title>시간표 - BSM</title>
      </Head>
      <div className='container _120 rows'>
        <TimetableList timetable={timetable} />
      </div>
      <ul className={`${styles.select_day} button-wrap`}>{
        dayNames.map((name, i) => (
          <li
            key={name}
            className={i === day ? styles.active : ''}
            onClick={() => setDay(i)}
          >
            {name}
          </li>
        ))
      }</ul>
      {
        !focus &&
        <Button className={styles.sync_button} onClick={() => {
          timetableListRef.current?.scrollTo({
            left: scrollX
          });
          setDay(new Date().getDay());
          setFocus(true);
        }}>
          현재 시간과 동기화
        </Button>
      }
      <div className={styles.select_box}>
        <TimetableClassMenu grade={grade} classNo={classNo} setGrade={setGrade} setClassNo={setClassNo} />
      </div>
      <div className={styles.timetable_wrap}>
        <div className={styles.time_wrap}>
          <h2 className={!focus ? 'gray' : ''}>{time}</h2>
          <h2>{date}</h2>
        </div>
        {timetable.length > 0 && <div className={styles.time_line}></div>}
        <ul
          className={`${styles.timetable} scroll-bar horizontal`}
          ref={timetableListRef}
          onScroll={e => {
            if (!numberInBetween(scrollX - 2, scrollX + 2, e.currentTarget.scrollLeft)) {
              setFocus(false);
            }
          }}
        >{
            timetable.map((timetable, i) => (
              <li key={i} className={`${styles[timetable.type]} ${i === currentTimeIndex ? styles.active : ''}`}>
                {
                  i !== 0 &&
                  <span className={styles.start_time}>
                    {timetable.startTime.split(':').filter((str, j) => j != 2).join(':')}
                  </span>
                }
                <span className={styles.class_name}>{timetable.className}</span>
              </li>
            ))
          }</ul>
      </div>
    </>
  );
}

export default TimetablePage;