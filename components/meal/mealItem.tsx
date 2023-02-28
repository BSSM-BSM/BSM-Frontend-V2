import styles from '../../styles/meal.module.css';
import { Dispatch, SetStateAction } from "react";
import { MealType } from "../../types/meal.types";
import { dateToKoreanDateStr, shrotDateStrToDate } from '../../utils/date';

interface MealItemProps {
  meal: MealType,
  i: number,
  middleIdx: number,
  setMealIdx: Dispatch<SetStateAction<number>>,
  isSameDay: boolean,
  checkShowMealDate: (meal: MealType, i: number) => boolean
}

const dateColor = (date: string): number => {
  const year = Number(date.substring(0, 2));
  const month = Number(date.substring(2, 4));
  const day = Number(date.substring(4, 6));
  return (((year * 100) + (month * 10) + day) % 2);
}

const calColor = (calInfo: number): string => {
  if (calInfo > 900) return styles.red;
  if (calInfo > 800) return styles.yellow;
  return styles.green;
}

export const MealItem = ({
  meal,
  i,
  middleIdx,
  setMealIdx,
  isSameDay,
  checkShowMealDate
}: MealItemProps) => (
  <li
    key={`${meal.date}${meal.time}`}
    onClick={() => {
      if (middleIdx > i) {
        setMealIdx(prev => prev - ((middleIdx) - i));
      } else if (middleIdx < i) {
        setMealIdx(prev => prev - ((middleIdx) - i));
      }
    }}
    className={`${middleIdx === i ? styles.center : ''} ${styles[`date_color_${dateColor(meal.date)}`]}`}
  >
    <div>
      {(
        (isSameDay && middleIdx === i) || (!isSameDay && checkShowMealDate(meal, i))
      ) && (
          <h3 className={styles.date}>
            {dateToKoreanDateStr(shrotDateStrToDate(meal.date))}
          </h3>
        )}
      {meal.time && <h4 className={`${styles.meal_info} ${calColor(meal.cal ?? 0)}`}>{meal.time} ({meal.cal} Kcal)</h4>}
      <div className={styles.content}>
        {meal.content.split('  ').map(content => <p key={content}>{content}</p>)}
      </div>
    </div>
  </li>
);