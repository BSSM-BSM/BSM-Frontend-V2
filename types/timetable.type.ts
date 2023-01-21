export interface TimetableInfo {
    className: string,
    type: string,
    startTime: string,
    endTime: string
}

export interface TimetableManageInfo {
    id: number,
    name: string,
    modifiedAt: string
}

export interface TimetableManageItemType {
    className: string,
    type: string,
    startTime: string,
    endTime: string,
    day: number,
    idx: number
}

export enum TimetableManageMode {
    ADD,
    EDIT,
    DELETE
}