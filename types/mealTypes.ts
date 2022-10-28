export enum MealTime {
    MORNING = '아침',
    LUNCH = '점심',
    DINNER = '저녁'
}

export interface MealType {
    date: string,
    time?: MealTime,
    content: string,
    cal?: number
}