import styles from '../../styles/timetable/timetable-manage.module.css'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TimetableInfo, TimetableManageMode } from "../../types/timetable.type";
import { Button } from "../common/buttons/button";
import { NumberInput } from "../common/inputs/numberInput";
import { TextInput } from "../common/inputs/textInput";
import Modal from "../common/modal";
import { useModal } from '../../hooks/useModal';
import { shortTimeStrToTotalSecond } from '../../utils/date';
import { useOverlay } from '../../hooks/useOverlay';

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
  const { closeModal } = useModal();
  const { showToast } = useOverlay();
  const [className, setClassName] = useState('');
  const [startHour, setStartHour] = useState(0);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(0);
  const [endMinute, setEndMinute] = useState(0);
  const [classType, setClassType] = useState('normal');

  const init = () => {
    if (!timetableList[selectIdx]) return;

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

  const addTimetable = (startTime: string, endTime: string) => {
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

  const editTimetable = (startTime: string, endTime: string) => {
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

  const timetableHandler = () => {
    if (shortTimeStrToTotalSecond(`${startHour}:${startMinute}:0`) > shortTimeStrToTotalSecond(`${endHour}:${endMinute}:0`)) {
      showToast('종료 시간을 시작 시간보다 이후로 설정해주세요');
      return;
    }
    const startTime = `${startHour}:${String(startMinute).padStart(2, '0')}:00`;
    let endTime = `${endHour}:${String(endMinute).padStart(2, '0')}:00`;
    if (endHour >= 24 || (endHour === 23 && endMinute === 59)) endTime = '23:59:59';

    if (mode === TimetableManageMode.ADD) addTimetable(startTime, endTime);
    else if (mode === TimetableManageMode.EDIT) editTimetable(startTime, endTime);
  }

  useEffect(init, [mode, selectIdx]);

  return (
    <Modal
      type="main"
      id="manageTimetableItem"
      title={mode === TimetableManageMode.ADD ? '시간표 추가' : mode === TimetableManageMode.EDIT ? '시간표 수정' : ''}
      onOpen={init}
    >
      <form
        className='cols gap-1'
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          timetableHandler();
        }}
      >
        <TextInput
          setCallback={setClassName}
          placeholder="이름"
          maxLength={30}
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
                value={mode === TimetableManageMode.EDIT ? startHour : undefined}
                full
                required
              />
              <NumberInput
                setCallback={setStartMinute}
                placeholder="분"
                min={0}
                max={59}
                value={mode === TimetableManageMode.EDIT ? startMinute : undefined}
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
                value={mode === TimetableManageMode.EDIT ? endHour : undefined}
                full
                required
              />
              <NumberInput
                setCallback={setEndMinute}
                placeholder="분"
                min={0}
                max={59}
                value={mode === TimetableManageMode.EDIT ? endMinute : undefined}
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
        <Button type="submit" className="accent">{mode === TimetableManageMode.ADD ? '추가' : mode === TimetableManageMode.EDIT ? '수정' : ''}</Button>
      </form>
    </Modal>
  );
}