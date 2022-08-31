import styles from '../../styles/meister/ranking.module.css';
import { MeisterRanking } from '../../types/meisterType';
import { elapsedTime } from '../../utils/util';

interface MeisterRankingItemProps {
    ranking: MeisterRanking,
    i: number
}

export const MeisterRankingItem = ({ranking, i}: MeisterRankingItemProps) => (
    <li>
        <div className={styles.rank}>{i + 1}</div>
        <div className={styles.info_wrap}>
            <div className={styles.student_info}>
                <span>
                    {`${ranking.student.grade}${ranking.student.classNo}${String(ranking.student.studentNo).padStart(2, '0')}`}
                </span>
                <span>{ranking.student.name}</span>
            </div>
            <div className={styles.score_info_wrap}>
                {
                    ranking.loginError
                    ?'정보를 자동으로 불러올 수 없습니다'
                    :<>
                        <div className={styles.score_info}>
                            <span>{ranking.score}</span>
                            <span>{ranking.positivePoint}</span>
                            <span>{ranking.negativePoint}</span>
                        </div>
                        <span className={styles.last_update}>Update: {elapsedTime(ranking.lastUpdate)}</span>
                    </>
                }
            </div>
        </div>
    </li>
);