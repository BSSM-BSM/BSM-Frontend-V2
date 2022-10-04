import styles from '../../styles/board/post.module.css';
import commentStyles from '../../styles/board/comment.module.css';
import { Board, Comment, DeletedComment, DetailPost } from "../../types/boardType";
import { CommentView } from './commentView';
import { CommentWrite } from './commentWrite';
import { useRecoilState } from 'recoil';
import { boardDetailTimeState, postListState, postState } from '../../store/board.store';
import { elapsedTime } from '../../utils/util';
import { escapeAttrValue, FilterXSS } from 'xss';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useEffect, useState } from 'react';
import { headerOptionState } from '../../store/common.store';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';
import { getProfileSrc } from '../../utils/util';
import { useModal } from '../../hooks/useModal';
import { EmoticonBox } from './emoticonBox';

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
    board,
    post,
    commentList,
    loadComments
}: {
    board: Board,
    post: DetailPost,
    commentList: (Comment | DeletedComment)[],
    loadComments: Function
}) => {
    const [, setPostList] = useRecoilState(postListState);
    const router = useRouter();
    const {ajax} = useAjax();
    const {openModal} = useModal();
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const [, setPost] = useRecoilState(postState);
    const [boardDetailTime] = useRecoilState(boardDetailTimeState);
    const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

    useEffect(() => {
        setHeaderOption({
            title: post.title,
            allMenu: 'goBack',
            optionMenu: post.permission
                ? {
                    dropdownMenu: [
                        {text: '글 수정', callback: () => router.push(`/board/${board.boardId}/write/${post.id}`)},
                        {text: '글 삭제', callback: deletePost},
                        {text: '이모티콘(테스트)', callback: () => openModal('emoticon')},
                        {text: '이모티콘 관리(관리자 전용)', callback: () => openModal('emoticon_manage_box')}
                    ]
                }
                : undefined
        });
        setProfileSrc(getProfileSrc(post.user.code));
    }, [post]);

    const postLike = (like: number) => {
        ajax<LikeRes>({
            url: `like/${board.boardId}/${post.id}`,
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

    const deletePost = () => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        ajax({
            url: `post/${board.boardId}/${post.id}`,
            method: HttpMethod.DELETE,
            callback() {
                setPostList(prev => prev.filter(e => e.id !== post.id));
                router.push(`/board/${board.boardId}`);
            }
        });
    }

    return (
        <div className='container _110'>
            <Head>
                <title>{post.title} - 커뮤니티 - BSM</title>
            </Head>
            <div className={styles.post_wrap}>
                <div className={styles.post_info}>
                    <div className={`user-profile ${styles.user_profile}`}>
                        <Image
                            src={profileSrc}
                            onError={() => setProfileSrc(DefaultProfilePic)}
                            width='128px'
                            height='128px'
                            alt='user profile'
                        />
                    </div>
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
            {
                board.commentPermission &&
                <div className={`${commentStyles.write_bar} container _110`}>
                    <CommentWrite loadComments={loadComments} />
                </div>
            }
        </div>
    );
}