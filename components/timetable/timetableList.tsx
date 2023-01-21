import styles from '../../styles/timetable/timetable.module.css';
import { TimetableInfo } from "../../types/timetable.type"

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