
import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { titleState } from '../../../store/common.store';
import { Board, BoardListRes, Category } from '../../../types/boardType';
import { BoardView } from '../../../components/board/boardView';

const BoardPage: NextPage = () => {
    const { ajax } = useAjax();
    const [, setTitle] = useRecoilState(titleState);
    const router = useRouter();
    const [ { boardId }, postId ] = [router.query, router.query.params?.[0]];
    const [boardList, setBoardList] = useState<{[index: string]: Board}>({});
    
    useEffect(() => {
        if (typeof boardId !== 'string') return setTitle('');
        if (postId === undefined) setTitle(boardList[boardId]?.boardName);
    }, [boardId, postId, boardList]);

    useEffect(() => {
        if (typeof boardId !== 'string') return;
        ajax<BoardListRes>({
            method: HttpMethod.GET,
            url: `board/${boardId}`,
            callback(data) {
                const categoryList: {[index: string]: Category} = {};
                data.categoryList.forEach(category => {
                    categoryList[category.id] = category;
                });
                setBoardList(prev => ({
                    ...prev,
                    [data.boardId]: {
                        ...data,
                        categoryList
                    }
                }));
            },
            errorCallback(data) {
                if (data && data.statusCode === 404) {
                    if (typeof boardId !== 'string') return;
                    setBoardList(prev => {
                        delete prev[boardId];
                        return prev;
                    });
                }
            },
        });
    }, [boardId]);

    return (
        <div className='container _120'>
            <Head>
                <title>커뮤니티 - BSM</title>
            </Head>
            {
                typeof boardId === 'string' 
                && boardList[boardId] 
                && <BoardView boardId={boardId} board={boardList[boardId]} />
            }
        </div>
    );
}

export default BoardPage
