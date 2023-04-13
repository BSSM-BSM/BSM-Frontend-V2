export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export interface NoLoginUser {
  isLogin: false
}

interface LoginUser {
  isLogin: true,
  code: number,
  nickname: string,
  email: string,
  level: number,
  role: UserRole
}

export interface Student extends LoginUser {
  role: UserRole.STUDENT,
  student: StudentInfo
}

export interface Teacher extends LoginUser {
  role: UserRole.TEACHER,
  teacher: TeacherInfo
}

export interface StudentInfo {
  name: string
  enrolledAt: number,
  grade: number,
  classNo: number,
  studentNo: number,
}

export interface TeacherInfo {
  name: string
}