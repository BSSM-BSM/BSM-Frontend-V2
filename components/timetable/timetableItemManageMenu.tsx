import styles from '../../styles/timetable/timetable-manage.module.css'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TimetableInfo, TimetableManageMode } from "../../types/timetableType";
import { Button } from "../common/buttons/button";
import { NumberInput } from "../common/inputs/numberInput";
import { TextInput } from "../common/inputs/textInput";
import Modal from "../common/modal";
import { useModal } from '../../hooks/useModal';

interface TimetableItemManageMenuProps {
    timetableList: TimetableInfo[],
    setTimetableList: Dispatch<SetStateAction<TimetableInfo[]>>,
    selectIdx: number,
    mode: TimetableManageMode
}

export const TimetableItemManageMenu = (props: TimetableItemManageMenuProps) => (
    <>
        <AddTimetable {...props} />
    </>
);

const AddTimetable = ({
    timetableList,
    setTimetableList,
    selectIdx,
    mode
}: TimetableItemManageMenuProps) => {
    const {closeModal} = useModal();
    const [className, setClassName] = useState('');
    const [startHour, setStartHour] = useState(0);
    const [startMinute, setStartMinute] = useState(0);
    const [endHour, setEndHour] = useState(0);
    const [endMinute, setEndMinute] = useState(0);
    const [classType, setClassType] = useState('normal');

    const init = () => {
        console.log(selectIdx)
        if (mode === TimetableManageMode.ADD) {
            setClassName('');
            setStartHour(0);
            setStartMinute(0);
            setEndHour(0);
            setEndMinute(0);
            setClassType('normal');

        } else if (mode === TimetableManageMode.EDIT) {
            const currentTimetable = timetableList[selectIdx];
            const tempStartTime = currentTimetable.startTime.split(':');
            const tempEndTime = currentTimetable.endTime.split(':');

            setClassName(currentTimetable.className);
            setStartHour(Number(tempStartTime[0]));
            setStartMinute(Number(tempStartTime[1]));
            setEndHour(Number(tempEndTime[0]));
            setEndMinute(Number(tempEndTime[1]));
            setClassType(currentTimetable.type);
        }
    }

    const addTimetable = () => {
        const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
        const endTime = `${endHour}:${String(endMinute).padStart(2, '0')}:00`;
        setTimetableList(prev => [
            ...prev.slice(0, selectIdx + 1),
            {
                className,
                startTime,
                endTime,
                type: classType
            },
            ...prev.slice(selectIdx + 1)
        ]);
        closeModal('manageTimetableItem');
    }

    const editTimetable = () => {
        const startTime = `${startHour}:${String(startMinute).padStart(2, '0')}:00`;
        const endTime = `${endHour}:${String(endMinute).padStart(2, '0')}:00`;
        setTimetableList(prev => {
            prev[selectIdx] = {
                className,
                startTime,
                endTime,
                type: classType
            };
            return prev;
        });
        closeModal('manageTimetableItem');
    }

    useEffect(init, [mode, selectIdx]);

    return (
        <Modal
            type="main"
            id="manageTimetableItem"
            title={mode === TimetableManageMode.ADD? '시간표 추가': mode === TimetableManageMode.EDIT? '시간표 수정': ''}
            callback={init}
        >
            <form
                className='cols gap-1'
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    if (mode === TimetableManageMode.ADD) addTimetable();
                    else if (mode === TimetableManageMode.EDIT) editTimetable();
                }}
            >
                <TextInput
                    setCallback={setClassName}
                    placeholder="이름"
                    maxLength={12}
                    value={className}
                    full
                    required
                />
                <div className="rows gap-1">
                    <div className={styles.time_input_wrap}>
                        <p>시작 시간</p>
                        <div>
                            <NumberInput
                                setCallback={setStartHour}
                                placeholder="시"
                                min={0}
                                max={24}
                                value={mode === TimetableManageMode.EDIT? startHour: undefined}
                                full
                                required
                            />
                            <NumberInput
                                setCallback={setStartMinute}
                                placeholder="분"
                                min={0}
                                max={59}
                                value={mode === TimetableManageMode.EDIT? startMinute: undefined}
                                full
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.time_input_wrap}>
                        <p>종료 시간</p>
                        <div>
                            <NumberInput
                                setCallback={setEndHour}
                                placeholder="시"
                                min={0}
                                max={24}
                                value={mode === TimetableManageMode.EDIT? endHour: undefined}
                                full
                                required
                            />
                            <NumberInput
                                setCallback={setEndMinute}
                                placeholder="분"
                                min={0}
                                max={59}
                                value={mode === TimetableManageMode.EDIT? endMinute: undefined}
                                full
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className='rows gap-1'>{
                    [{
                        name: '일반',
                        value: 'normal'
                    },
                    {
                        name: '쉬는시간',
                        value: 'break'
                    },
                    {
                        name: '수업',
                        value: 'class'
                    },
                    {
                        name: '방과후',
                        value: 'after'
                    }].map(type => (
                        <label key={type.value} className='checkbox'>
                            {type.name}
                            <input
                                type="radio"
                                value={type.value}
                                checked={classType === type.value}
                                onChange={(event) => setClassType(event.target.value)}
                            />
                        </label>
                    ))
                }</div>
                <Button type="submit" className="accent">{mode === TimetableManageMode.ADD? '추가': mode === TimetableManageMode.EDIT? '수정': ''}</Button>
            </form>
        </Modal>
    );
}