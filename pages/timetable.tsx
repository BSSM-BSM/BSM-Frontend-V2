import styles from '../styles/timetable.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../store/account.store';
import { useAjax } from '../hooks/useAjax';
import { useModal } from '../hooks/useModal';
import Modal from '../components/common/modal';
import { useInterval } from '../hooks/useInterval';

interface TimetableInfo {
    className: string,
    type: string,
    startTime: string,
    endTime: string
}

const TimetablePage: NextPage = () => {
    const { ajax } = useAjax();
    const [user] = useRecoilState(userState);
    const [grade, setGrade] = useState(user.grade);
    const [classNo, setClassNo] = useState(user.classNo);
    const [day, setDay] = useState(new Date().getDay());
    const [timetableList, setTimetableList] = useState<TimetableInfo[]>([]);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        loadTimetableInfo();
    }, []);

    useInterval(() => {
        const newDate = new Date();

        const currentTime = newDate.toLocaleTimeString('ko-KR', {hour12: false, timeStyle: 'medium'});
        if (time == currentTime) return;
        setTime(currentTime);

        const currentDate = newDate.toLocaleDateString();
        if (date == currentDate) return;
        setDate(currentDate);
    }, 500);

    const loadTimetableInfo = () => {
        ajax<TimetableInfo[]>({
            url: `timetable/${grade}/${classNo}/${day}`,
            method: 'get',
            callback(data) {
                setTimetableList(data);
            },
            errorCallback() {
                setTimetableList([]);
            }
        });
    }

    return (
        <div>
            <div className='container _100'>
                <Head>
                    <title>시간표 - BSM</title>
                </Head>
                <div className='title center'>
                    <h1>시간표</h1>
                </div>
            </div>
            <div className={styles.timetable_wrap}>
                <div className={styles.time_wrap}>
                    <h2>{time}</h2>
                    <h2>{date}</h2>
                </div>
                <div className={styles.time_line}></div>
                <ul className={styles.timetable}>{
                    timetableList.map((timetable, i) => (
                        <li key={timetable.className}>
                            {
                                i == 0 &&
                                <span className={styles.start_time}>
                                    {timetable.startTime.split(':').filter((str, i) => i != 2).join(':')}
                                </span>
                            }
                            <span>{timetable.className}</span>
                            <span className={styles.end_time}>
                            {timetable.endTime.split(':').filter((str, i) => i != 2).join(':')}
                            </span>
                        </li>
                    ))
                }</ul>
            </div>
        </div>
    );
}

export default TimetablePage;