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

export const leftTime = (milliSecond: number) => {
  const times = [
    { name: "년", time: 1000 * 60 * 60 * 24 * 365 },
    { name: "개월", time: 1000 * 60 * 60 * 24 * 30 },
    { name: "일", time: 1000 * 60 * 60 * 24 },
    { name: "시간", time: 1000 * 60 * 60 },
    { name: "분", time: 1000 * 60 },
    { name: "초", time: 1000 }
  ];
  let leftTime = milliSecond;
  const formatedTimeList = [];
  for (const value of times) {
    if (leftTime / value.time < 1) continue;
    formatedTimeList.push(`${Math.floor(leftTime / value.time)}${value.name}`);
    leftTime %= value.time;
  }
  return formatedTimeList.join(' ');
}
