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
    loginError: boolean;
    lastUpdate: string;
}