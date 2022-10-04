import { StaticImageData } from 'next/image';
import DefaultProfilePic from '../public/icons/profile_default.png';

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

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export const dateToKoreanDateStr = (date: Date): string => {
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${dayNames[date.getDay()]}`;
}

export const getProfileSrc = (userCode: number): string | StaticImageData => 
    userCode > 0
    ? `https://auth.bssm.kro.kr/resource/user/profile/${userCode}.png`
    : DefaultProfilePic;