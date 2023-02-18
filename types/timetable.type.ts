export enum TimetableDayType {
  SUN = 0,
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6
}

export interface TimetableListRes {
  timetableList: TimetableListType
}

export type TimetableListType = {
  [key in keyof typeof TimetableDayType]: Timetable
}

export type Timetable = TimetableItem[];

export interface TimetableItem {
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

export type TimetableManage = TimetableManageItemType[];

export interface TimetableManageItemType {
  className: string,
  type: string,
  startTime: string,
  endTime: string,
  day: TimetableDayType,
  idx: number
}

export enum TimetableManageMode {
  ADD,
  EDIT,
  DELETE
}