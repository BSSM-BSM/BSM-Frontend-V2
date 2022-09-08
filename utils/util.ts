export const decodeBase64 = (str: string): string => {
    // base64를 decoding하는 함수인 atob는 -나 _가 들어있으면 작동안하므로 각각 +, /로 변환해줌
    // atob로 디코드 해도 한글은 제대로 나오지 않으므로 escape로 유니코드로 변환후 decodeURI로 복호화함
    return decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
}

export const numberInBetween = (start: number | undefined, end: number | undefined, given: number): boolean => {
    if (start === undefined && end === undefined) return true;
    if (start === undefined || end === undefined) {
        if (start !== undefined && given >= start) return true;
        if (end !== undefined && given <= end) return true;
        return false;
    }
    if (given >= start && given <= end) return true;
    return false;
}

export const elapsedTime = (time: string): string => {
    const diff = (new Date().getTime() - new Date(time).getTime());
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

export const shrotStrToDate = (
    str: string // 220909, 211231
): Date => {
    const year = Number(`20${str.substring(0, 2)}`);
    const month = Number(str.substring(2, 4)) - 1;
    const day = Number(str.substring(4, 6));
    return new Date(year, month, day);
}

export const dateToShortStr = (date: Date): string => {
    const year = `${date.getFullYear()}`.substring(2, 4);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`;
}