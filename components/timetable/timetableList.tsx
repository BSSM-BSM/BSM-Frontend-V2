import styles from '@/styles/timetable/timetable.module.css';
import { Timetable } from "@/types/timetable.type"

interface TimetableListProps {
  timetable: Timetable
}

export const TimetableList = ({
  timetable
}: TimetableListProps) => <>
  <ul className={styles.timetable_list}>{
    timetable
      .filter(item => item.type === 'class')
      .map(item => <li key={`${item.startTime}/${item.endTime}`}>{item.className}</li>)
  }</ul>
</>