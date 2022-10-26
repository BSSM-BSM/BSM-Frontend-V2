import styles from '../styles/timetable.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../store/account.store';
import { HttpMethod, useAjax } from '../hooks/useAjax';
import { useInterval } from '../hooks/useInterval';
import { useOverlay } from '../hooks/useOverlay';
import { numberInBetween } from '../utils/util';
import { headerOptionState } from '../store/common.store';
import { UserRole } from '../types/userType';
import { TimetableClassMenu } from '../components/timetable/timetableClassMenu';
import { TimetableInfo } from '../types/timetableType';
import { TimetableList } from '../components/timetable/timetableList';

const TimetablePage: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const { ajax } = useAjax();
    const { showAlert } = useOverlay();
    const [user] = useRecoilState(userState);
    const [grade, setGrade] = useState(0);
    const [classNo, setClassNo] = useState(0);
    const [day, setDay] = useState(new Date().getDay());
    const [timetableList, setTimetableList] = useState<TimetableInfo[]>([]);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    const timetableListRef = useRef<HTMLUListElement>(null);
    const [focus, setFocus] = useState(true);
    const [scrollX, setScrollX] = useState(0);
    const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
    const dayNames = ['일', '월', '화', '수', '목', '금'];

    useEffect(() => {
        setHeaderOption({title: '시간표'});
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
        if (day !== new Date().getDay()) {
            setFocus(false);
            setCurrentTimeIndex(-1);
        }
    }, [day, grade, classNo]);

    const timeTableRender = () => {
        if (!timetableList.length) return;
        
        const newDate = new Date();

        const currentTime = newDate.toLocaleTimeString('ko-KR', {hour12: false, timeStyle: 'medium'});
        if (time == currentTime) return;
        setTime(currentTime);

        if (focus && day !== newDate.getDay()) {
            setDay(newDate.getDay());
        }

        if (day === newDate.getDay()) {
            syncTimetable(newDate);
        }

        const currentDate = newDate.toLocaleDateString();
        if (date == currentDate) return;
        setDate(currentDate);
    }

    useInterval(timeTableRender, 500);

    useEffect(timeTableRender, [timetableList]);
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
        timetableList.some((timetable, i) => {
            startTotalTime = convertTime(timetable.startTime);
            endTotalTime = convertTime(timetable.endTime);
            currentTotalTime = convertTime(`${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`);
            if (startTotalTime <= currentTotalTime && currentTotalTime <= endTotalTime) {
                currentTimeIndex = i;
                setCurrentTimeIndex(i);
                return true;
            }
        });
        
        if (focus) {
            const normalElOffset = 350;
            const breaktimeElOffset = 150;
            let totalOffset = 0;

            timetableList.some((timetable, i) => {
                if (currentTimeIndex <= i) {
                    totalOffset += ((currentTotalTime - startTotalTime) / (endTotalTime - startTotalTime)) * (timetable.type === 'break'? breaktimeElOffset: normalElOffset);
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

    const convertTime = (dateString: string): number => {
        const temp = dateString.split(':');
        return (Number(temp[0]) * 60 * 60) + (Number(temp[1]) * 60) + Number(temp[2]);
    }

    const loadTimetableInfo = async () => {
        const [data, error] = await ajax<TimetableInfo[]>({
            url: `timetable/${grade}/${classNo}/${day}`,
            method: HttpMethod.GET,
            errorCallback() {
                setTimetableList([]);
            }
        });
        if (error) return;
        
        const newTimetableList: TimetableInfo[] = [];
        data.forEach((timetable, i, arr) => {
            newTimetableList.push(timetable);
            if (timetable.type === 'class' && ['class', 'after'].includes(arr[i + 1]?.type)) {
                newTimetableList.push({
                    className: '쉬는시간',
                    type: 'break',
                    startTime: timetable.endTime,
                    endTime: data[i + 1].startTime
                });
            }
        });
        setTimetableList(newTimetableList);
        if (!newTimetableList.length) {
            showAlert('시간표 데이터가 없습니다');
        }
    }

    return (
        <>
            <Head>
                <title>시간표 - BSM</title>
            </Head>
            <div className='container _120 rows'>
                <TimetableList timetableList={timetableList} />
            </div>
            <ul className={`${styles.select_day} button-wrap`}>{
                dayNames.map((name, i) => (
                    <li
                        key={name}
                        className={i === day? styles.active: ''}
                        onClick={() => setDay(i)}
                    >
                        {name}
                    </li>
                ))
            }</ul>
            {
                !focus && 
                <button className={`${styles.sync_button} button`} onClick={() => {
                    timetableListRef.current?.scrollTo({
                        left: scrollX
                    });
                    setDay(new Date().getDay());
                    setFocus(true);
                }}>
                    현재 시간과 동기화
                </button>
            }
            <div className={styles.select_box}>
                <TimetableClassMenu grade={grade} classNo={classNo} setGrade={setGrade} setClassNo={setClassNo} />
            </div>
            
            <div className={styles.timetable_wrap}>
                <div className={styles.time_wrap}>
                    <h2 className={!focus? 'gray': ''}>{time}</h2>
                    <h2>{date}</h2>
                </div>
                {timetableList.length > 0 && <div className={styles.time_line}></div>}
                <ul
                    className={styles.timetable}
                    ref={timetableListRef}
                    onScroll={e => {
                        if (!numberInBetween(scrollX-2, scrollX+2, e.currentTarget.scrollLeft)) {
                            setFocus(false);
                        }
                    }}
                >{
                    timetableList.map((timetable, i) => (
                        <li key={i} className={`${styles[timetable.type]} ${i === currentTimeIndex? styles.active: ''}`}>
                            {
                                i !== 0 &&
                                <span className={styles.start_time}>
                                    {timetable.startTime.split(':').filter((str, j) => j != 2).join(':')}
                                </span>
                            }
                            <span>{timetable.className}</span>
                        </li>
                    ))
                }</ul>
            </div>
        </>
    );
}

export default TimetablePage;