'use client';

import styles from '../../../styles/timetable/timetable.module.css';
import manageStyles from '../../../styles/timetable/timetable-manage.module.css';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { headerOptionState, pageState } from '../../../store/common.store';
import { Timetable, TimetableDayType, TimetableItem, TimetableListType, TimetableManageInfo, TimetableManageMode } from '../../../types/timetable.type';
import { TimetableList } from '../../../components/timetable/timetableList';
import { dayNames } from '../../../utils/date';
import { TimetableItemManageMenu } from '../../../components/timetable/timetableItemManageMenu';
import { useModal } from '../../../hooks/useModal';
import { TimetableManageSideBar } from '../../../components/timetable/timetableManageSideBar';
import { useSearchParams } from 'next/navigation';

const TimetableManagePage = () => {
  const searchParams = useSearchParams();
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { openModal } = useModal();
  const [grade, setGrade] = useState(0);
  const [classNo, setClassNo] = useState(0);
  const [day, setDay] = useState(new Date().getDay());
  const [dayKey, setDayKey] = useState(TimetableDayType.SUN);

  const [manageItem, setManageItem] = useState<TimetableManageInfo | null>(null);
  const [timetableList, setTimetableList] = useState<TimetableListType | null>(null);
  const [timetable, setTimetable] = useState<Timetable>([]);
  const [selectIdx, setSelectIdx] = useState(0);
  const [mode, setMode] = useState<TimetableManageMode>(TimetableManageMode.ADD);

  let classIdx = 0;

  useEffect(() => {
    setHeaderOption({ title: '시간표 관리', headTitle: '시간표 관리 - BSM' });
    setPage({ id: 'timetable' });
  }, []);

  useEffect(() => {
    setGrade(Number(searchParams.get('grade') ?? 1));
    setClassNo(Number(searchParams.get('classNo') ?? 1));
    setDay(Number(searchParams.get('day') ?? 0));
  }, [searchParams]);

  useEffect(() => {
    setDayKey(TimetableDayType[day] as unknown as TimetableDayType);
  }, [day]);

  useEffect(() => {
    if (!timetableList) return setTimetable([]);

    setTimetable(timetableList[dayKey] ?? []);
  }, [dayKey, timetableList]);

  useEffect(() => {
    if (!timetableList) return;
    setTimetableList(prev => {
      if (!prev) return prev;
      prev[dayKey] = timetable;
      return prev;
    });
  }, [timetable])

  const addHandler = () => {
    setMode(TimetableManageMode.ADD);
    openModal('manageTimetableItem');
  }

  const editHandler = () => {
    setMode(TimetableManageMode.EDIT);
    openModal('manageTimetableItem');
  }

  const deleteHandler = (i: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setTimetable(prev => [
      ...prev.slice(0, i),
      ...prev.slice(i + 1)
    ]);
  }

  const timetableItem = (item: TimetableItem, i: number) => (
    <li key={i} className={styles[item.type]} onClick={() => setSelectIdx(i)}>
      {
        i === 0 &&
        <button
          onClick={e => {
            e.stopPropagation();
            setSelectIdx(-1);
            addHandler();
          }}
          className={`${manageStyles.add_item} ${manageStyles.left}`}
        >
          <span>+</span>
        </button>
      }
      {
        i !== 0 &&
        <span className={styles.start_time}>
          {item.startTime.split(':').filter((str, j) => j != 2).join(':')}
        </span>
      }
      {
        item.type === 'class' &&
        <span className={styles.class_idx}>
          {++classIdx} 교시
        </span>
      }
      <button onClick={addHandler} className={`${manageStyles.add_item} ${manageStyles.right}`}><span>+</span></button>
      <button onClick={editHandler} className={manageStyles.edit_item}><span>···</span></button>
      <button onClick={() => deleteHandler(i)} className={manageStyles.delete_item}><span>-</span></button>
      <span className={styles.class_name}>{item.className}</span>
    </li>
  );

  return (<>
    <TimetableItemManageMenu timetable={timetable} setTimetable={setTimetable} selectIdx={selectIdx} mode={mode} />
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
    <TimetableManageSideBar
      setManageItem={setManageItem}
      timetableList={timetableList}
      setTimetableList={setTimetableList}
      grade={grade}
      classNo={classNo}
      setGrade={setGrade}
      setClassNo={setClassNo}
    />
    <div className={styles.timetable_wrap}>
      <ul className={`${styles.timetable} scroll-bar horizontal`}>
        {timetable.map((item, i) => timetableItem(item, i))}
      </ul>
      {
        manageItem &&
        !timetable.length &&
        <div className={manageStyles.no_timetable}>
          <p>아래 버튼을 눌러 시간표를 추가하세요</p>
          <button onClick={() => { setSelectIdx(-1); addHandler() }} className={manageStyles.add_item}><span>+</span></button>
        </div>
      }
    </div>
  </>);
}

export default TimetableManagePage;