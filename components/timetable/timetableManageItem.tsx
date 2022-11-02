import styles from '../../styles/timetable/timetable-manage.module.css'
import { Dispatch, SetStateAction } from "react";
import { TimetableManageInfo } from "../../types/timetableType";
import { elapsedTime, MilliSecondTime } from '../../utils/date';

interface TimetableManageItemProps {
    item: TimetableManageInfo,
    selectId: number,
    setSelectId: Dispatch<SetStateAction<number>>
}

export const TimetableManageItem = ({
    item,
    selectId,
    setSelectId
}: TimetableManageItemProps) => (
    <li className={`cols ${item.id === selectId? styles.active: ''}`} onClick={() => setSelectId(item.id)}>
        <h3>{item.name}</h3>
        <p>최근 수정: {elapsedTime(item.modifiedAt, MilliSecondTime.MONTH)}</p>
    </li>
);