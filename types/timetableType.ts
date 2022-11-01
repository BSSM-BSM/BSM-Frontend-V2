export interface TimetableInfo {
    className: string,
    type: string,
    startTime: string,
    endTime: string
}

export enum TimetableManageMode {
    ADD,
    EDIT,
    DELETE
}