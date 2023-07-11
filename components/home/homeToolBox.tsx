import styles from '@/styles/home.module.css';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { useModal } from '@/hooks/useModal';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import { widgetLockState } from '@/store/widget.store';

export const HomeToolBox = () => {
  const { openModal } = useModal();
  const [isWidgetLock, setIsWidgetLock] = useRecoilState(widgetLockState);

  return (
    <div className="rows gap-05">
      <HiOutlinePencilAlt
        size="2rem"
        className={styles.edit_background_image}
        onClick={() => openModal('edit-background-image')}
      />
      {
        isWidgetLock
        ?<BiLockAlt
          size="2rem"
          className={styles.edit_background_image}
          onClick={() => setIsWidgetLock(false)}
        />
        :<BiLockOpenAlt
          size="2rem"
          className={styles.edit_background_image}
          onClick={() => setIsWidgetLock(true)}
        />
      }
    </div>
  )
};
