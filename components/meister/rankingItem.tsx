import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { userState } from '@/store/account.store';
import styles from '@/styles/meister/ranking.module.css';
import { MeisterRanking, MeisterResultType } from '@/types/meister.type';
import { UserRole } from '@/types/user.type';
import { elapsedTime } from '@/utils/date';

interface MeisterRankingItemProps {
  ranking: MeisterRanking,
  i: number,
  updatePrivateRanking: (flag: boolean) => void
}

export const MeisterRankingItem = ({ ranking, i, updatePrivateRanking }: MeisterRankingItemProps) => {
  const router = useRouter();
  const [user] = useRecoilState(userState);
  const { grade, classNo, studentNo, name } = ranking.student;

  const scoreInfoView = () => {
    switch (ranking.result) {
      case MeisterResultType.SUCCESS: return (
        <>
          <div className={styles.score_info}>
            <span>{ranking.score}</span>
            <span>{ranking.positivePoint}</span>
            <span>{ranking.negativePoint}</span>
          </div>
          <span className={styles.last_update}>Update: {elapsedTime(ranking.lastUpdate)}</span>
        </>
      );
      case MeisterResultType.LOGIN_ERROR: return (
        <>
          <div className={styles.score_info}>
            <span>{ranking.score}</span>
            <div>{'상벌점을 불러올 수 없음'}</div>
          </div>
          <span className={styles.last_update}>Update: {elapsedTime(ranking.lastUpdate)}</span>
        </>
      );
      case MeisterResultType.PRIVATE: return '랭킹을 비공개로 설정하였습니다';
    }
  }

  const myRankingCheck = (): boolean => (
    user.isLogin && user.role === UserRole.STUDENT &&
    grade === user.student.grade &&
    classNo === user.student.classNo &&
    studentNo === user.student.studentNo
  );

  const viewMyMeisterInfo = () => router.push(`/meister?grade=${grade}&classNo=${classNo}&studentNo=${studentNo}`);

  return (
    <li className={styles.item} onClick={() => !myRankingCheck() && viewMyMeisterInfo()}>
      <div className={styles.rank}>{i + 1}</div>
      <div className={styles.info_wrap}>
        <div className={styles.student_info}>
          <span>
            {`${grade}${classNo}${String(studentNo).padStart(2, '0')}`}
          </span>
          <span>{name}</span>
          {
            myRankingCheck() &&
            ranking.result !== MeisterResultType.LOGIN_ERROR &&
            <span onClick={() => updatePrivateRanking(true)}>비공개로 변경</span>
          }
        </div>
        <div className={styles.score_info_wrap}>
          {scoreInfoView()}
        </div>
      </div>
    </li>
  )
};