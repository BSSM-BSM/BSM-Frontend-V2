import styles from '../../styles/timetable/timetable-manage.module.css'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TimetableInfo, TimetableManageInfo, TimetableManageItemType } from "../../types/timetableType";
import { TimetableManageItem } from './timetableManageItem';
import { Button } from '../common/buttons/button';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { TimetableManageMenu } from './timetableManageMenu';
import { TimetableClassMenu } from './timetableClassMenu';
import { useOverlay } from '../../hooks/useOverlay';

interface TimetableManageListProps {
    setManageItem: Dispatch<SetStateAction<TimetableManageInfo | null>>,
    allTimetableList: TimetableInfo[][],
    setAllTimetableList: Dispatch<SetStateAction<TimetableInfo[][]>>,
    grade: number,
    classNo: number,
    setGrade: Dispatch<number>,
    setClassNo: Dispatch<number>
}

export const TimetableManageSideBar = ({
    setManageItem,
    allTimetableList,
    setAllTimetableList,
    grade,
    classNo,
    setGrade,
    setClassNo
}: TimetableManageListProps) => {
    const {ajax} = useAjax();
    const {openModal} = useModal();
    const {showToast} = useOverlay();
    const [isOpen, setIsOpen] = useState(true);
    const [selectId, setSelectId] = useState(0);
    const [manageList, setManageList] = useState<TimetableManageInfo[]>([]);

    const loadManageList = async () => {
        const [data, error] = await ajax<TimetableManageInfo[]>({
            url: `admin/timetable/${grade}/${classNo}`,
            method: HttpMethod.GET,
            errorCallback() {
                setManageList([]);
            }
        });
        if (error) return;

        setManageList(data);
    }

    const loadAllTimetableList = async () => {
        const [data, error] = await ajax<TimetableInfo[][]>({
            url: `admin/timetable/${selectId}`,
            method: HttpMethod.GET,
            errorCallback() {
                setAllTimetableList([]);
            }
        });
        if (error) return;

        setAllTimetableList(data);
    }

    const saveTimetableList = async () => {
        const newTimetableList: TimetableManageItemType[] = [];
        allTimetableList.forEach((timetableList, day) => {
            timetableList?.forEach((timetable, idx) => {
                newTimetableList.push({
                    ...timetable,
                    day,
                    idx
                })
            })
        });

        const [, error] = await ajax<TimetableInfo[][]>({
            url: `admin/timetable/${selectId}/list`,
            method: HttpMethod.PUT,
            payload: {
                timetableList: newTimetableList
            }
        });
        if (error) return;

        showToast('저장 완료');
    }

    const importTimetableList = () => {
        const value = prompt('JSON 설정 값 입력');
        if (!value) return;
        setAllTimetableList(JSON.parse(value));
        showToast('설정을 불러왔습니다');
    }

    const exportTimetableList = () => {
        navigator.clipboard.writeText(JSON.stringify(allTimetableList));
        showToast('JSON 값이 클립보드에 복사되었습니다');
    }

    const deleteTimetableList = async () => {
        const [, error] = await ajax<TimetableInfo[][]>({
            url: `admin/timetable/${selectId}`,
            method: HttpMethod.DELETE
        });
        if (error) return;

        loadManageList();
        setSelectId(0);
    }

    const applyTimetableList = async () => {
        const [, error] = await ajax<TimetableInfo[][]>({
            url: `admin/timetable/${selectId}/apply`,
            method: HttpMethod.PUT
        });
        if (error) return;

        showToast('시간표가 적용되었습니다');
    }

    useEffect(() => {
        if (!selectId) return;
        loadAllTimetableList();
    }, [selectId]);

    useEffect(() => {
        if (!grade || !classNo) return;
        loadManageList();
        setSelectId(0);
    }, [grade, classNo]);
    
    useEffect(() => {
        setManageItem(() => manageList.find(item => item.id === selectId) ?? null);
    }, [selectId])

    return (
        <div className={`${styles.side_bar} ${isOpen? styles.open: ''}`}>
            <div onClick={() => setIsOpen(prev => !prev)} className={styles.on_off}>
                {isOpen? '>': '<'}
            </div>
            <TimetableManageMenu loadManageList={loadManageList} grade={grade} classNo={classNo} />
            <ul className={styles.list}>
                <div className='rows'>
                    <TimetableClassMenu grade={grade} classNo={classNo} setGrade={setGrade} setClassNo={setClassNo} />
                </div>
                {
                    manageList.map((item, i) => <TimetableManageItem key={item.id} item={item} selectId={selectId} setSelectId={setSelectId} />)
                }
                <Button full onClick={() => openModal('createTimetable')}>새로 만들기</Button>
            </ul>
            {
                selectId !== 0 &&
                <ul className='cols gap-05'>
                    <li className='rows gap-05'>
                        <Button className='flex-main' onClick={importTimetableList}>불러오기</Button>
                        <Button className='flex-main' onClick={exportTimetableList}>내보내기</Button>
                    </li>
                    <li className='rows gap-05'>
                        <Button className='delete flex-main' onClick={deleteTimetableList}>삭제</Button>
                        <Button className='accent flex-main' onClick={saveTimetableList}>저장</Button>
                    </li>
                    <li>
                        <Button className='accent' full onClick={applyTimetableList}>적용</Button>
                    </li>
                </ul>
            }
        </div>
    );
}
