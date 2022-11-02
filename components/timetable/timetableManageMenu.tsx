import styles from '../../styles/timetable/timetable-manage.module.css'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TimetableInfo, TimetableManageMode } from "../../types/timetableType";
import { Button } from "../common/buttons/button";
import { NumberInput } from "../common/inputs/numberInput";
import { TextInput } from "../common/inputs/textInput";
import Modal from "../common/modal";
import { useModal } from '../../hooks/useModal';
import { HttpMethod, useAjax } from '../../hooks/useAjax';

interface TimetableManageMenuProps {
    loadManageList: () => void,
    grade: number,
    classNo: number
}

export const TimetableManageMenu = (props: TimetableManageMenuProps) => (
    <>
        <CreateTimetable {...props} />
    </>
);

const CreateTimetable = ({
    loadManageList,
    grade,
    classNo
}: TimetableManageMenuProps) => {
    const {ajax} = useAjax();
    const {closeModal} = useModal();
    const [name, setName] = useState('');
    const [type, setType] = useState('NORMAL');

    const init = () => {
        setName('');
        setType('NORMAL');
    }

    const createTimetable = async () => {
        const [, error] = await ajax<TimetableInfo[][]>({
            url: `admin/timetable`,
            method: HttpMethod.POST,
            payload: {
                name,
                type,
                grade,
                classNo
            }
        });
        if (error) return;

        closeModal('createTimetable');
        loadManageList();
    }

    return (
        <Modal
            type="main"
            id="createTimetable"
            title='시간표 만들기'
            callback={init}
        >
            <form
                className='cols gap-1'
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    createTimetable()
                }}
            >
                <TextInput
                    setCallback={setName}
                    placeholder="이름"
                    maxLength={12}
                    value={name}
                    full
                    required
                />
                <div className='rows gap-1'>{
                    [{
                        name: '일반',
                        value: 'NORMAL'
                    },
                    {
                        name: '단축수업',
                        value: 'SHORT'
                    },
                    {
                        name: '시간표 변경',
                        value: 'CHANGE'
                    }].map(timetableType => (
                        <label key={timetableType.value} className='checkbox'>
                            {timetableType.name}
                            <input
                                type="radio"
                                value={timetableType.value}
                                checked={type === timetableType.value}
                                onChange={(event) => setType(event.target.value)}
                            />
                        </label>
                    ))
                }</div>
                <Button type="submit" className="accent">만들기</Button>
            </form>
        </Modal>
    );
}