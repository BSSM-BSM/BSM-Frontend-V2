export interface MeisterInfo {
  scoreHtmlContent: string;
  pointHtmlContent: string;
  score: number;
  positivePoint: number;
  negativePoint: number;
}

export interface HomeMenuMeisterInfo {
  isLoading: boolean;
  score?: number;
  positivePoint?: number;
  negativePoint?: number;
  lastUpdate: string;
  uniqNo?: string;
  loginError?: boolean;
  error: string | false;
}

export enum MeisterResultType {
  SUCCESS = 'SUCCESS',
  PRIVATE = 'PRIVATE',
  LOGIN_ERROR = 'LOGIN_ERROR'
}

export interface MeisterRanking {
  score: number;
  positivePoint: number;
  negativePoint: number;
  student: {
    grade: number,
    classNo: number,
    studentNo: number,
    name: string
  };
  result: MeisterResultType;
  lastUpdate: string;
}