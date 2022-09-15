import styles from '../../styles/board/post.module.css';
import { DetailPost } from "../../types/boardType";

export const postView = ({post}: {post: DetailPost}) => {

    return (
        <div>
            <div className={styles.post_wrap}>
                <div className={styles.post_info}>
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}