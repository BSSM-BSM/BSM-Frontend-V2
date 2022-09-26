import styles from '../../styles/board/post.module.css';
import commentStyles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment, DetailPost } from "../../types/boardType";
import { CommentView } from './commentView';
import { CommentWrite } from './commentWrite';
import { useRecoilState } from 'recoil';
import { boardDetailTimeState, postState } from '../../store/board.store';
import { elapsedTime } from '../../utils/util';
import { escapeAttrValue, FilterXSS } from 'xss';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useEffect } from 'react';
import { headerOptionState } from '../../store/common.store';
import { useRouter } from 'next/router';

const codeblockRegexp = /^(language\-.*)/;
const postXssFilter = new FilterXSS({
    onIgnoreTagAttr: (tag, name, value) => {
        if (name === 'style') return `${name}="${escapeAttrValue(value)}"`;
        if (tag === 'img') {
            if (name === 'e_id') return `${name}="${escapeAttrValue(value)}"`;
            if (name === 'e_idx') return `${name}="${escapeAttrValue(value)}"`;
            if (name === 'e_type') return `${name}="${escapeAttrValue(value)}"`;
        }
        if (tag === 'pre' && codeblockRegexp.test(value)) return `${name}="${escapeAttrValue(value)}"`;
    },
    onIgnoreTag: (tag, html) => {
        if (tag === 'iframe') return html;
    }
});

interface LikeRes {
    like: number,
    totalLikes: number
}

export const PostView = ({
    boardId,
    post,
    commentList,
    loadComments
}: {
    boardId: string,
    post: DetailPost,
    commentList: (Comment | DeletedComment)[],
    loadComments: Function
}) => {
    const router = useRouter();
    const {ajax} = useAjax();
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const [, setPost] = useRecoilState(postState);
    const [boardDetailTime] = useRecoilState(boardDetailTimeState);

    useEffect(() => {
        setHeaderOption({
            title: post.title,
            allMenu: 'goBack',
            optionMenu: post.permission
                ? {
                    dropdownMenu: [
                        {text: '글 수정', callback: () => router.push(`/board/${boardId}/write/${post.id}`)}
                    ]
                }
                : undefined
        });
    }, [post]);

    const postLike = (like: number) => {
        ajax<LikeRes>({
            url: `like/${boardId}/${post.id}`,
            method: HttpMethod.POST,
            payload: {
                like
            },
            callback(data) {
                setPost(prev => {
                    if (prev === null) return prev;
                    return {
                        ...prev,
                        like: data.like,
                        totalLikes: data.totalLikes
                    }
                });
            },
        })
    }

    return (
        <div className='container _110'>
            <div className={styles.post_wrap}>
                <div className={styles.post_info}>
                    <img className={`user-profile ${styles.user_profile}`} src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${post.user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                    <div className='cols space-between flex-main'>
                        <h2 className={styles.title}>{post.title}</h2>
                        <div className='rows space-between'>
                            <span className='bold'>{post.user.nickname}</span>
                            <div className='rows gap-2 gray'>
                                <span>{post.totalComments} 댓글</span>
                                <span>조회 {post.hit}</span>
                                <span>{
                                    boardDetailTime
                                    ? new Date(post.createdAt).toLocaleString()
                                    : elapsedTime(post.createdAt)
                                }</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={styles.post_content}
                    dangerouslySetInnerHTML={{__html: postXssFilter.process(post.content)}}
                />
            </div>
            <div className={styles.like_wrap}>
                <button onClick={() => postLike(1)} className={`button-wrap ${styles.like} ${post.like === 1? styles.on: ''}`}>
                    <img src="/icons/like.svg" alt="like" />
                </button>
                <span>{post.totalLikes}</span>
                <button onClick={() => postLike(-1)} className={`button-wrap ${styles.dislike} ${post.like === -1? styles.on: ''}`}>
                    <img src="/icons/like.svg" alt="dislike" />
                </button>
            </div>
            <CommentView commentList={commentList} loadComments={loadComments} boardDetailTime={boardDetailTime} />
            <div className={`${commentStyles.write_bar} container _110`}>
                <CommentWrite loadComments={loadComments} />
            </div>
        </div>
    );
}