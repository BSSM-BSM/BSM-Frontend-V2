'use client';

import boardStyles from '@/styles/board/board.module.css';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { headerOptionState, pageState } from '@/store/common.store';
import axios from 'axios';
import lostfoundStyle from '@/styles/board/lostfound.module.css';
import Head from 'next/head';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { LostFoundItem } from '@/components/board/lostfoundItem';
import { PostWrite } from '@/components/board/post/postWrite';
import Link from 'next/link';
// import

const LostFound = () => {
  const { ajax } = useAjax();
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);

  const [foundedItems, setFoundedItems] = React.useState([]);
  const [lostItems, setLostItems] = React.useState([]);
  const [category, setCategory] = React.useState('IN_PROGRESS');

  React.useEffect(() => {
    setPage({ id: 'board', subId: 'lost-found' });
    setHeaderOption({ title: '분실물 찾기' });
    // if (postId === 'write')
    // 	setHeaderOption({
    // 		title: `글쓰기 ${boardAnonymousMode ? '(익명 On)' : '(익명 Off)'}`,
    // 	})
  }, []);

  React.useEffect(() => {
    (async () => {
      const [data, error] = await ajax<any>({
        method: HttpMethod.GET,
        url: `https://bssm.kro.kr/api/lost-found/find/process/IN_PROGRESS`,
        errorCallback() {
          setLostItems([]);
        }
      });
      setLostItems(data);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const [data, error] = await ajax<any>({
        method: HttpMethod.GET,
        url: `https://bssm.kro.kr/api/lost-found/find/process/FINISHED`,
        errorCallback() {
          setFoundedItems([]);
        }
      });
      setFoundedItems(data);
    })();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>커뮤니티 - BSM</title>
      </Head>
      <div className={lostfoundStyle.container_wrap}>
        <div className={lostfoundStyle.category_list}>
          <div
            className={lostfoundStyle.category}
            style={{ backgroundColor: category === 'IN_PROGRESS' ? '#282828' : '#383838' }}
            onClick={() => setCategory('IN_PROGRESS')}
          >
            대기중
          </div>
          <div
            className={lostfoundStyle.category}
            style={{ backgroundColor: category === 'FINISHED' ? '#282828' : '#383838' }}
            onClick={() => setCategory('FINISHED')}
          >
            찾은 물건
          </div>
        </div>
        <div className={lostfoundStyle.board_list}>
          {category === 'IN_PROGRESS' ? (
            <>
              {lostItems &&
                lostItems?.map((item: any, index) => (
                  <LostFoundItem
                    key={item.id}
                    id={item.id}
                    objectName={item.objectName}
                    imgSrc={item.imgSrc}
                    process={item.process}
                  />
                ))}
            </>
          ) : (
            <>
              {foundedItems &&
                foundedItems?.map((item: any, index) => (
                  <LostFoundItem
                    key={item.id}
                    id={item.id}
                    objectName={item.objectName}
                    imgSrc={item.imgSrc}
                    process={item.process}
                  />
                ))}
            </>
          )}
        </div>
      </div>
      <Link href={`/board/lostfound/write`} className={boardStyles.write}>
        <img src="/icons/pen.svg" alt="글쓰기" />
      </Link>
    </div>
  );
};

export default LostFound;
