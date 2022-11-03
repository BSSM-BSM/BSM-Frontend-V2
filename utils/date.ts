export enum MilliSecondTime {
    YEAR = 1000 * 60 * 60 * 24 * 365,
    MONTH = 1000 * 60 * 60 * 24 * 30,
    DAY = 1000 * 60 * 60 * 24,
    HOUR = 1000 * 60 * 60,
    MINUTE = 1000 * 60 * 60,
}

export const elapsedTime = (time: string, maxTime?: number | MilliSecondTime): string | null => {
    const diff = (new Date().getTime() - new Date(time).getTime());
    if (maxTime && diff >= maxTime) return null;
    const times = [
        {name: "년", time: 1000 * 60 * 60 * 24 * 365},
        {name: "개월", time: 1000 * 60 * 60 * 24 * 30},
        {name: "일", time: 1000 * 60 * 60 * 24},
        {name: "시간", time: 1000 * 60 * 60},
        {name: "분", time: 1000 * 60},
    ];
    for (const value of times) {
        const betweenTime = Math.floor(diff / value.time);
        if (betweenTime > 0) return `${betweenTime}${value.name} 전`;
    }
    return "방금 전";
}

export const shrotDateStrToDate = (
    str: string // 220909, 211231
): Date => {
    const year = Number(`20${str.substring(0, 2)}`);
    const month = Number(str.substring(2, 4)) - 1;
    const day = Number(str.substring(4, 6));
    return new Date(year, month, day);
}

export const dateToShortDateStr = (date: Date): string => {
    const year = `${date.getFullYear()}`.substring(2, 4);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`;
}

export const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export const dateToKoreanDateStr = (date: Date): string => 
    `${date.getMonth() + 1}월 ${date.getDate()}일 ${dayNames[date.getDay()]}`;

export const dateToShortTimeStr = (date: Date): string => 
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

export const shortTimeStrToTotalSecond = (
    str: string // 7:30:26, 21:02:04
): number => {
    const temp = str.split(':');
    return (Number(temp[0]) * 60 * 60) + (Number(temp[1]) * 60) + Number(temp[2]);
}

export const timeToTotalSecond = (time: Date): number => {
    return (time.getHours() * 60 * 60) + (time.getMinutes() * 60) + time.getSeconds();
}