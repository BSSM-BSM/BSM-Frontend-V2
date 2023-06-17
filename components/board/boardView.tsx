import styles from '@/styles/board/board.module.css';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { Board, PostListRes } from '@/types/board.type';
import { PostItem } from '@/components/board/postItem';
import { useRecoilState } from 'recoil';
import { postListState } from '@/store/board.store';
import { CheckList } from '@/components/common/buttons/checkList';
import { postLimitState } from '@/store/setting/board.store';

interface BoardViewProps {
  boardId: string;
  board: Board;
}

export const BoardView = ({ boardId, board }: BoardViewProps) => {
  const { ajax } = useAjax();
  const [postLimit] = useRecoilState(postLimitState);
  const [postList, setPostList] = useRecoilState(postListState);
  const [postCategory, setPostCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [postLoadRef, inView] = useInView();

  useEffect(() => {
    if (loading) return;
    else loadPosts(-1);
  }, [postCategory, boardId]);

  useEffect(() => {
    if (!postList.length || !inView || loading) return;
    loadPosts(postList[postList.length - 1]?.id ?? -1);
  }, [inView]);

  const loadPosts = async (startPostId: number) => {
    setLoading(true);
    const [data, error] = await ajax<PostListRes>({
      method: HttpMethod.GET,
      url: `post/${boardId}${startPostId === -1 ? '/recent' : ''}`,
      config: {
        params: {
          startPostId,
          limit: postLimit,
          category: postCategory
        }
      },
      errorCallback() {
        setLoading(false);
      }
    });
    if (error) return;

    if (startPostId === -1) setPostList(data.postList);
    else if (data.postList.length) setPostList(prev => [...prev, ...data.postList]);
    setLoading(false);
  };

  return (
    <div className={`${styles.board} scroll-bar`}>
      <div className="container">
        <div className={styles.category_list_wrap}>
          <CheckList
            currentItem={postCategory}
            callback={item => setPostCategory(item.id)}
            itemList={[
              { id: 'all', name: '전체' },
              { id: 'normal', name: '일반' },
              ...Object.values(board.categoryList)
            ]}
          />
        </div>
        <ul className={styles.post_list}>
          {postList.map(post => {
            return (
              <PostItem
                key={`${boardId}/${post.id}/${post.user.code}`}
                {...post}
                boardId={String(boardId)}
                categoryList={board.categoryList}
              />
            );
          })}
          {postList[postList.length - 1]?.id > 1 && <li ref={postLoadRef} className={styles.post_load_bar}></li>}
        </ul>
      </div>
    </div>
  );
};
