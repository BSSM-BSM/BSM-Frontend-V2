import { Dispatch } from "react"
import { Button } from "../common/buttons/button"

interface Props {
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
}: Props) => <>
    <span className='dropdown-menu'>
        <Button className='select'>{grade}학년</Button>
        <ul className='dropdown-content'>{
            [1, 2, 3].map(i => (
                <li
                    className='option'
                    key={i}
                    onClick={() => setGrade(i)}
                >
                    {i}학년
                </li>
            ))
        }</ul>
    </span>
    <span className='dropdown-menu'>
        <Button className='select'>{classNo}반</Button>
        <ul className='dropdown-content'>{
            [1, 2, 3, 4].map(i => (
                <li
                    className='option'
                    key={i}
                    onClick={() => setClassNo(i)}
                >
                    {i}반
                </li>
            ))
        }</ul>
    </span>
</>