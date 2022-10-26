import { Dispatch } from "react"

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
        <span className='select button'>{grade}학년</span>
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
        <span className='select button'>{classNo}반</span>
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