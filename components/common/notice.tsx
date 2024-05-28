import styles from '@/styles/common/notice.module.css';
import Link from 'next/link';

export const Notice = () => (
  <div className={styles.notice_bar}>
    <Link href='https://bssm.app/board/notice/20' className={`${styles.notice}`}>BSM 사이트 주소가 bssm.app으로 변경되었습니다</Link>
  </div>
);
