import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from '../styles/meal.module.css';

enum MealTime {
    MORNING = 'morning',
    LUNCH = 'lunch',
    DINNER = 'dinner'
}

interface MealType {
    date: string,
    time: MealTime,
    content: string
}

const MealPage: NextPage = () => {
    const mealList: MealType[] = [
        {
            date: '220907',
            time: MealTime.MORNING,
            content: '아침'
        },
        {
            date: '220907',
            time: MealTime.LUNCH,
            content: '점심'
        },
        {
            date: '220907',
            time: MealTime.DINNER,
            content: '저녁'
        },
        {
            date: '220908',
            time: MealTime.MORNING,
            content: '아침'
        },
        {
            date: '220908',
            time: MealTime.LUNCH,
            content: '점심'
        },
        {
            date: '220908',
            time: MealTime.DINNER,
            content: '저녁'
        },
        {
            date: '220909',
            time: MealTime.MORNING,
            content: '아침'
        },
        {
            date: '220909',
            time: MealTime.LUNCH,
            content: '점심'
        },
        {
            date: '220909',
            time: MealTime.DINNER,
            content: '저녁'
        }
    ];
    const [renderMealList, setRenderMealList] = useState<MealType[]>([]);
    const [mealIdx, setMealIdx] = useState<number>(2);
    const [viewRange, setViewRange] = useState<number>(5);
    const [isSameDay, setIsSameDay] = useState<boolean>(false);
    const [startBlank, setStartBlank] = useState<number>(0);
    const [endBlank, setEndBlank] = useState<number>(0);

    useEffect(() => {
        renderMeal();
    }, [mealIdx, viewRange]);

    const renderMeal = () => {
        if (viewRange % 2 == 0) throw new Error('Even range is not available');

        const offset = Math.floor(viewRange / 2);

        const tempMealList: MealType[] = [];
        let tempStartBlank = 0;
        let tempEndBlank = 0;
        
        // 렌더링될 급식 리스트 가져오기
        [...Array(viewRange).keys()].forEach(i => {
            if (mealList[mealIdx - offset + i])
                tempMealList.push(mealList[mealIdx - offset + i]);
            else {
                // 양옆에 남는 공간을 채우기 위해 몇 칸이 비는지 카운팅
                if (offset > i)
                    tempStartBlank++;
                else if (offset < i)
                    tempEndBlank++;
            }
        });

        // 전부 같은 날인지 확인
        tempMealList.some((meal, i) => {
            if (tempMealList[0].date !== meal.date) {
                setIsSameDay(false);
                return true;
            }
            if (i === tempMealList.length-1) {
                setIsSameDay(true);
                return false;
            }
        });

        setRenderMealList(tempMealList);
        setStartBlank(tempStartBlank);
        setEndBlank(tempEndBlank);
    }

    const checkShowMealDate = (meal: MealType, i: number): boolean => {
        const next = renderMealList[i+1];
        if (i == 0 && next?.date === meal.date) {
            return false;
        }
        const prev = renderMealList[i-1];
        if ((i == renderMealList.length-1) && prev?.date === meal.date) {
            return false;
        }
        if (prev?.date === meal.date && next?.date === meal.date) {
            return false;
        }
        return true;
    }

    const dateColor = (date: string): number => {
        const year = Number(date.substring(0, 2));
        const month = Number(date.substring(2, 4));
        const day = Number(date.substring(4, 6));

        return (((year * 100) + (month * 10) + day) % 3);
    }

    return (
        <div>
            <div className="container">
                <Head>
                    <title>급식 - BSM</title>
                </Head>
                <div className="title center">
                    <h1>급식</h1>
                </div>
                <ul className={styles.meals}>
                    {
                        // 왼쪽에 남는 공간 채우기
                        [...Array(startBlank).keys()].map(i => <li key={i}></li>)
                    }
                    {
                        renderMealList.map((meal, i) => {
                            const middleIdx = Math.floor((renderMealList.length - startBlank + endBlank) / 2);
                            return (
                                <li 
                                    key={`${meal.date}${meal.time}`}
                                    onClick={() => {
                                        if (middleIdx > i) {
                                            setMealIdx(prev => prev - ((middleIdx) - i));
                                        } else if (middleIdx < i) {
                                            setMealIdx(prev => prev - ((middleIdx) - i));
                                        }
                                    }}
                                    className={`${middleIdx === i? styles.center: ''} ${styles[`date_color_${dateColor(meal.date)}`]}`}
                                >
                                    {
                                        isSameDay
                                        ? middleIdx === i && <h3>
                                            {meal.date}
                                        </h3>
                                        : (
                                            checkShowMealDate(meal, i) &&
                                            <h3>
                                                {meal.date}
                                            </h3>
                                        )
                                    }
                                    <div className={styles.content}>
                                        {meal.time}
                                        {i}
                                    </div>
                                </li>
                            )
                        })
                    }
                    {
                        // 오른쪽에 남는 공간 채우기
                        [...Array(endBlank).keys()].map(i => <li key={i}></li>)
                    }
                </ul>
            </div>
        </div>
    );
}

export default MealPage;