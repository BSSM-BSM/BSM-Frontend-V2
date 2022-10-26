import styles from '../../styles/timetable.module.css';
import { TimetableInfo } from "../../types/timetableType"

interface Props {
    timetableList: TimetableInfo[]
}

export const TimetableList = ({
    timetableList
}: Props) => <>
    <ul className={styles.timetable_list}>{
        timetableList
            .filter(timetable => timetable.type === 'class')
            .map(timetable => <li key={`${timetable.startTime}/${timetable.endTime}`}>{timetable.className}</li>)
    }</ul>
</>