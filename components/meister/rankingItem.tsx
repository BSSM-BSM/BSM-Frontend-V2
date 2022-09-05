import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import styles from '../../styles/meister/ranking.module.css';
import { MeisterRanking, MeisterResultType } from '../../types/meisterType';
import { elapsedTime } from '../../utils/util';

interface MeisterRankingItemProps {
    ranking: MeisterRanking,
    i: number,
    updatePrivateRanking: (flag: boolean) => void
}

export const MeisterRankingItem = ({ranking, i, updatePrivateRanking}: MeisterRankingItemProps) => {
    const [user] = useRecoilState(userState);
    const { grade, classNo, studentNo } = ranking.student;

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
            case MeisterResultType.LOGIN_ERROR: return '정보를 자동으로 불러올 수 없습니다';
            case MeisterResultType.PRIVATE: return '랭킹을 비공개로 설정하였습니다';
        }
    }

    return (
        <li>
            <div className={styles.rank}>{i + 1}</div>
            <div className={styles.info_wrap}>
                <div className={styles.student_info}>
                    <span>
                        {`${ranking.student.grade}${ranking.student.classNo}${String(ranking.student.studentNo).padStart(2, '0')}`}
                    </span>
                    <span>{ranking.student.name}</span>
                    {
                        grade === user.grade &&
                        classNo === user.classNo &&
                        studentNo === user.studentNo &&
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