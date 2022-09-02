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