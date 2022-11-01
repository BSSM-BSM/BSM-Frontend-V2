import styles from '../../styles/timetable/timetable.module.css';
import manageStyles from '../../styles/timetable/timetable-manage.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { headerOptionState } from '../../store/common.store';
import { TimetableClassMenu } from '../../components/timetable/timetableClassMenu';
import { TimetableInfo, TimetableManageMode } from '../../types/timetableType';
import { TimetableList } from '../../components/timetable/timetableList';
import { dayNames } from '../../utils/date';
import Modal from '../../components/common/modal';
import { TimetableManageMenu } from '../../components/timetable/timetableManageMenu';
import { useModal } from '../../hooks/useModal';

const TimetableManagePage: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const {ajax} = useAjax();
    const {openModal} = useModal();
    const [grade, setGrade] = useState(1);
    const [classNo, setClassNo] = useState(1);
    const [day, setDay] = useState(new Date().getDay());
    const [timetableList, setTimetableList] = useState<TimetableInfo[]>([]);
    const [selectIdx, setSelectIdx] = useState(0);
    const [mode, setMode] = useState<TimetableManageMode>(TimetableManageMode.ADD);

    useEffect(() => {
        setHeaderOption({title: '시간표 관리'});
    }, []);

    useEffect(() => {
        if (!grade || !classNo) return;
        
        loadTimetableInfo();
    }, [day, grade, classNo]);

    const loadTimetableInfo = async () => {
        const data: TimetableInfo[] = []
        // const [data, error] = await ajax<TimetableInfo[]>({
        //     url: `timetable/${grade}/${classNo}/${day}`,
        //     method: HttpMethod.GET,
        //     errorCallback() {
        //         setTimetableList([]);
        //     }
        // });
        // if (error) return;
        
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
    }

    const addHandler = () => {
        setMode(TimetableManageMode.ADD);
        openModal('manageTimetable');
    }

    const editHandler = () => {
        setMode(TimetableManageMode.EDIT);
        openModal('manageTimetable');
    }

    const deleteHandler = (i: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        setTimetableList(prev => [
            ...prev.slice(0, i),
            ...prev.slice(i + 1)
        ]);
    }

    const timetableItem = (timetable: TimetableInfo, i: number) => {
        return (
            <li key={i} className={styles[timetable.type]} onClick={() => setSelectIdx(i)}>
                {
                    i === 0 &&
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setSelectIdx(-1);
                            addHandler();
                        }}
                        className={`${manageStyles.add_item}
                        ${manageStyles.left}`}
                    >
                        <span>+</span>
                    </button>
                }
                {
                    i !== 0 &&
                    <span className={styles.start_time}>
                        {timetable.startTime.split(':').filter((str, j) => j != 2).join(':')}
                    </span>
                }
                <button onClick={addHandler} className={`${manageStyles.add_item} ${manageStyles.right}`}><span>+</span></button>
                <button onClick={editHandler} className={manageStyles.edit_item}><span>···</span></button>
                <button onClick={() => deleteHandler(i)} className={manageStyles.delete_item}><span>-</span></button>
                <span className={styles.class_name}>{timetable.className}</span>
            </li>
        );
    }

    return (
        <>
            <Head>
                <title>시간표 관리 - BSM</title>
            </Head>
            <TimetableManageMenu timetableList={timetableList} setTimetableList={setTimetableList} selectIdx={selectIdx} mode={mode} />
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
            <div className={styles.select_box}>
                <TimetableClassMenu grade={grade} classNo={classNo} setGrade={setGrade} setClassNo={setClassNo} />
            </div>
            <div className={styles.timetable_wrap}>
                {timetableList.length > 0 && <div className={styles.time_line}></div>}
                <ul className={`${styles.timetable} scroll-bar horizontal`}>
                    {timetableList.map((timetable, i) => timetableItem(timetable, i))}
                </ul>
                {
                    !timetableList.length &&
                    <div className={manageStyles.no_timetable}>
                        <p>아래 버튼을 눌러 시간표를 추가하세요</p>
                        <button onClick={() => {setSelectIdx(-1);addHandler()}} className={manageStyles.add_item}><span>+</span></button>
                    </div>
                }
            </div>
        </>
    );
}

export default TimetableManagePage;