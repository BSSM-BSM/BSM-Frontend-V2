'use client';

import styles from '@/styles/meal.module.css';
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { HttpMethod, useAjax } from "@/hooks/useAjax";
import { useOverlay } from "@/hooks/useOverlay";
import { screenScaleState, headerOptionState, pushSubscriptionState, pageState } from "@/store/common.store";
import { MealRes, MealTime, MealTimeRange, MealType } from "@/types/meal.types";
import { subscribe } from "@/utils/webPush";
import { MealItem } from '@/components/meal/mealItem';
import { Button } from '@/components/common/buttons/button';
import { dateToShortDateStr, shrotDateStrToDate, timeToTotalSecond } from '@/utils/date';
import { numberInBetween } from '@/utils/util';
import { BannerType } from '@/types/banner.type';
import { Banner, BannerPos } from '@/components/common/banner';

const MealPage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { ajax } = useAjax();
  const { showToast } = useOverlay();
  const [mealList, setMealList] = useState<MealType[]>([]);
  const [renderMealList, setRenderMealList] = useState<MealType[]>([]);
  const [mealIdx, setMealIdx] = useState<number>(0);
  const [viewRange, setViewRange] = useState<number>(5);
  const [isSameDay, setIsSameDay] = useState<boolean>(false);
  const [screenScale] = useRecoilState(screenScaleState);
  const [pushSubscription, setPushSubscription] = useRecoilState(pushSubscriptionState);

  // init
  useEffect(() => {
    setHeaderOption({ title: '급식', headTitle: '급식 - BSM' });
    setPage({ id: 'meal' });
    (async () => {
      const initialMeal = await loadMealList(dateToShortDateStr(new Date));
      calcNextTimeMeal(initialMeal);
      setMealList(initialMeal);
    })();
    window.addEventListener('resize', calcViewRange);
    return () => {
      window.removeEventListener('resize', calcViewRange);
    }
  }, []);

  useEffect(() => calcViewRange(), [screenScale])

  useEffect(() => {
    renderMeal();
  }, [mealList, mealIdx, viewRange]);

  const calcNextTimeMeal = (mealList: MealType[]) => {
    const nowTotalSecond = timeToTotalSecond(new Date());
    mealList.some((meal) => {
      return MealTimeRange.some((time, i) => {
        if (meal.time === undefined) {
          setMealIdx(prev => ++prev);
          return true;
        }
        if (!numberInBetween(time.startSecond, time.endSecond, nowTotalSecond)) return false;
        if (i > mealList.length) {
          setMealIdx(prev => prev + mealList.length);
          return true;
        };
        setMealIdx(prev => prev + i);
        return true;
      });
    });
  }

  const loadMealList = (date: string): Promise<MealType[]> => {
    return new Promise(async (resolve, reject) => {
      const [data, error] = await ajax<MealRes>({
        url: `meal/${date}`,
        method: HttpMethod.GET,
      });
      if (error) return reject();
      if (!Object.keys(data.data).length) {
        resolve([{
          date,
          content: '급식이 없습니다'
        }]);
      }

      const keys = Object.keys(MealTime);
      data.keys = data.keys.sort((a, b) => keys.indexOf(a) - keys.indexOf(b));
      resolve(
        data.keys.map(key => ({
          ...data.data[key],
          time: MealTime[key],
          date
        }))
      );
    })
  }

  const calcViewRange = () => {
    const screenWidth = ((window.innerWidth - 250) / screenScale) * 100;
    let range = Math.floor(screenWidth / 250);
    if (range < 3) range = 3;
    if (range % 2 === 0) range++;
    setViewRange(range);
  }

  const renderMeal = async () => {
    if (!mealList.length) return;
    if (viewRange % 2 == 0) throw new Error('Even range is not available');

    const offset = Math.floor(viewRange / 2);

    const loadPromises: {
      prev?: Promise<MealType[]>,
      next?: Promise<MealType[]>
    } = {};
    let loadFlag = false;

    const tempMealList: MealType[] = [];
    // 렌더링될 급식 리스트 가져오기
    [...Array(viewRange).keys()].forEach(i => {
      if (mealList[mealIdx - offset + i]) {
        tempMealList.push(mealList[mealIdx - offset + i]);
      } else {
        loadFlag = true;
        // 이전, 다음 급식 불러오기
        if (offset > i) {
          if (loadPromises.prev) return;
          const nextDate = mealList[mealIdx - offset + i + 1]?.date;
          if (!nextDate) return;

          const prevDate = shrotDateStrToDate(nextDate);
          prevDate.setDate(prevDate.getDate() - 1);

          loadPromises.prev = loadMealList(dateToShortDateStr(prevDate));
        } else {
          if (loadPromises.next) return;
          const prevDate = mealList[mealIdx - offset + i - 1]?.date;
          if (!prevDate) return;

          const nextDate = shrotDateStrToDate(prevDate);
          nextDate.setDate(nextDate.getDate() + 1);

          loadPromises.next = loadMealList(dateToShortDateStr(nextDate));
        }
      }
    });
    if (loadFlag) {
      const [prevMeals, nextMeals] = await Promise.all([
        loadPromises.prev ?? [],
        loadPromises.next ?? []
      ]);

      setMealList(prev => {
        return [...prevMeals, ...prev, ...nextMeals];
      });
      if (prevMeals.length) {
        setMealIdx(prev => prev + prevMeals.length);
      }
      return;
    };

    // 전부 같은 날인지 확인
    tempMealList.some((meal, i) => {
      if (tempMealList[0].date !== meal.date) {
        setIsSameDay(false);
        return true;
      }
      if (i === tempMealList.length - 1) {
        setIsSameDay(true);
        return false;
      }
    });

    setRenderMealList(tempMealList);
  }

  const checkShowMealDate = (meal: MealType, i: number): boolean => {
    const next = renderMealList[i + 1];
    if (i == 0 && next?.date === meal.date) {
      return false;
    }
    const prev = renderMealList[i - 1];
    if ((i == renderMealList.length - 1) && prev?.date === meal.date) {
      return false;
    }
    if (prev?.date === meal.date && next?.date === meal.date) {
      return false;
    }
    return true;
  }

  return (
    <div>
      <>
        <Banner position={BannerPos.TOP} type={BannerType.HORIZONTAL} />
      </>
      {
        pushSubscription === null &&
        <Button className={`${styles.notification_button} accent`} onClick={() => subscribe(ajax, setPushSubscription, showToast)}>급식 알림 받기</Button>
      }
      <div className={styles.meals_wrap}>
        <ul className={styles.meals}>
          {renderMealList.map((meal, i) => (
            <MealItem
              key={`${meal.date}/${meal.time}`}
              meal={meal}
              i={i}
              middleIdx={Math.floor((renderMealList.length) / 2)}
              setMealIdx={setMealIdx}
              isSameDay={isSameDay}
              checkShowMealDate={checkShowMealDate}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MealPage;