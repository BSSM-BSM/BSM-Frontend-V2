export enum MealTime {
  MORNING = '아침',
  LUNCH = '점심',
  DINNER = '저녁'
}

export const MealTimeRange = [
  {
    startSecond: 0, // 0:00
    endSecond: 27600, // 7:40
    timeName: MealTime.MORNING
  },
  {
    startSecond: 27600, // 7:40
    endSecond: 45600, // 12:40
    timeName: MealTime.LUNCH
  },
  {
    startSecond: 45600, // 12:40
    endSecond: 66000, // 18:20
    timeName: MealTime.DINNER
  },
  {
    startSecond: 66000, // 18:20
    endSecond: 86400, // 24:00
    timeName: MealTime.MORNING
  }
]

export interface MealType {
  date: string,
  time?: MealTime,
  content: string,
  cal?: number
}

type MealData = {
  [key in keyof typeof MealTime]: MealType;
}

export interface MealRes {
  data: MealData,
  keys: (keyof typeof MealTime)[]
}
