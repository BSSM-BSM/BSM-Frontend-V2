import styles from '@/styles/home.module.css';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { useModal } from '@/hooks/useModal';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import { widgetLockState } from '@/store/widget.store';
import * as S from '@/styles/home.style';
import { useOverlay } from '@/hooks/useOverlay';

export const HomeToolBox = () => {
  const { openModal } = useModal();
  const { showToast } = useOverlay();
  const [isWidgetLock, setIsWidgetLock] = useRecoilState(widgetLockState);

  const changeWidgetLock = () => {
    if (isWidgetLock) {
      setIsWidgetLock(false);
      showToast('위젯이 고정 해제됨');
      return;
    }
    setIsWidgetLock(true);
    showToast('위젯이 고정됨');
  }

  return (
    <S.ToolBox>
      <HiOutlinePencilAlt
        size="2rem"
        onClick={() => openModal('edit-background-image')}
      />
      {
        isWidgetLock
        ?<BiLockAlt
          size="2rem"
          onClick={changeWidgetLock}
        />
        :<BiLockOpenAlt
          size="2rem"
          onClick={changeWidgetLock}
        />
      }
    </S.ToolBox>
  )
};
