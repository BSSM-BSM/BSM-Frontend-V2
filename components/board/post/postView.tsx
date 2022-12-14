import styles from '../../../styles/board/post/post.module.css';
import commentStyles from '../../../styles/board/comment.module.css';
import { Board, Comment, DeletedComment, DetailPost } from "../../../types/boardType";
import { CommentView } from '../commentView';
import { CommentWrite } from '../commentWrite';
import { useRecoilState } from 'recoil';
import { boardDetailTimeState, postListState, postState } from '../../../store/board.store';
import { escapeAttrValue, FilterXSS } from 'xss';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { useEffect, useMemo, useState } from 'react';
import { headerOptionState } from '../../../store/common.store';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultProfilePic from '../../../public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';

import Prism from 'prismjs';
import "prismjs/plugins/toolbar/prism-toolbar.min";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/toolbar/prism-toolbar.min.css";
import { UserInfoLink } from '../userInfoLink';
import { getProfileSrc } from '../../../utils/userUtil';
import { elapsedTime } from '../../../utils/date';
import { DropdownMenu } from '../../common/dropdownMenu';
import { PostNavBar } from './postNavBar';

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
  const router = useRouter();
  const { ajax } = useAjax();
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const [, setPost] = useRecoilState(postState);
  const [postList, setPostList] = useRecoilState(postListState);
  const [boardDetailTime] = useRecoilState(boardDetailTimeState);
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);
  const dropdownMenu = [
    { text: '??? ??????', callback: () => router.push(`/board/${board.boardId}/write/${post.id}`) },
    { text: '??? ??????', callback: () => deletePost() }
  ];

  const prevAndNextPost = useMemo(() => {
    const postIdx = postList.findIndex(e => e.id === post.id);
    return {
      prevPost: postList[postIdx + 1],
      nextPost: postList[postIdx - 1]
    }
  }, [post.id, board.boardId, postList]);

  useEffect(() => {
    setHeaderOption({
      title: post.title,
      allMenu: {
        goBack: true
      },
      optionMenu: post.permission
        ? { dropdownMenu }
        : undefined
    });
    setProfileSrc(getProfileSrc(post.user.code));
    Prism.highlightAll();
  }, [post]);

  const postLike = async (like: number) => {
    const [data, error] = await ajax<LikeRes>({
      url: `like/${board.boardId}/${post.id}`,
      method: HttpMethod.POST,
      payload: {
        like
      },
    });
    if (error) return;

    setPost(prev => {
      if (prev === null) return prev;
      return {
        ...prev,
        like: data.like,
        totalLikes: data.totalLikes
      }
    });
  }

  const deletePost = async () => {
    if (!confirm('?????? ?????????????????????????')) return;
    const [, error] = await ajax({
      url: `post/${board.boardId}/${post.id}`,
      method: HttpMethod.DELETE,
    });
    if (error) return;

    setPostList(prev => prev.filter(e => e.id !== post.id));
    router.push(`/board/${board.boardId}`);
  }

  return (
    <div className='container _110'>
      <Head>
        <title>{post.title} - ???????????? - BSM</title>
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
              <span className='bold'>
                <UserInfoLink userCode={post.user.code} nickname={post.user.nickname} />
              </span>
              <div className='rows gap-2 gray'>
                <span>{post.totalComments} ??????</span>
                <span>?????? {post.hit}</span>
                <span>{
                  boardDetailTime
                    ? new Date(post.createdAt).toLocaleString()
                    : elapsedTime(post.createdAt)
                }</span>
                {post.permission &&
                  <DropdownMenu
                    meatballsMenu={true}
                    menus={dropdownMenu}
                    className='post-dropdown-menu'
                  />}
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.post_content}
          dangerouslySetInnerHTML={{ __html: postXssFilter.process(post.content) }}
        />
      </div>
      <div className={styles.like_wrap}>
        <button onClick={() => postLike(1)} className={`button-wrap ${styles.like} ${post.like === 1 ? styles.on : ''}`}>
          <img src="/icons/like.svg" alt="like" />
        </button>
        <span>{post.totalLikes}</span>
        <button onClick={() => postLike(-1)} className={`button-wrap ${styles.dislike} ${post.like === -1 ? styles.on : ''}`}>
          <img src="/icons/like.svg" alt="dislike" />
        </button>
      </div>
      <PostNavBar {...prevAndNextPost} boardId={board.boardId} />
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