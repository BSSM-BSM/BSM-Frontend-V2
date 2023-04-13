import { Dispatch } from "react"
import { DropdownMenu } from "@/components/common/dropdownMenu"

interface TimetableClassMenuProps {
  grade: number,
  classNo: number,
  setGrade: Dispatch<number>,
  setClassNo: Dispatch<number>
}

export const TimetableClassMenu = ({
  grade,
  classNo,
  setGrade,
  setClassNo
}: TimetableClassMenuProps) => <>
  <DropdownMenu
    title={`${grade}학년`}
    menus={[1, 2, 3].map(i => ({
      text: `${i}학년`, callback: () => setGrade(i)
    }))}
    mark
    button
  />
  <DropdownMenu
    title={`${classNo}반`}
    menus={[1, 2, 3, 4].map(i => ({
      text: `${i}반`, callback: () => setClassNo(i)
    }))}
    mark
    button
  />
</>