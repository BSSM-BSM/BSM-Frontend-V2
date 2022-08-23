export const decodeBase64 = (str: string): string => {
    // base64를 decoding하는 함수인 atob는 -나 _가 들어있으면 작동안하므로 각각 +, /로 변환해줌
    // atob로 디코드 해도 한글은 제대로 나오지 않으므로 escape로 유니코드로 변환후 decodeURI로 복호화함
    return decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
}

export const numberInBetween = (start: number, end: number, given: number): boolean => {
    if (given >= start && given <= end) return true;
    return false;
}