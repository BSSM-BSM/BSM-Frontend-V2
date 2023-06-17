'use client';

import boardStyles from '@/styles/board/board.module.css';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { headerOptionState, pageState, themeState } from '@/store/common.store';
import lostfoundStyle from '@/styles/board/lostfound.module.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { LostFoundItem } from '@/components/board/lostfoundItem';
import Link from 'next/link';

const LostFound = () => {
  const { ajax } = useAjax();
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const theme = useRecoilValue(themeState);

  const [foundedItems, setFoundedItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [category, setCategory] = useState('IN_PROGRESS');

  useEffect(() => {
    setPage({ id: 'board', subId: 'lost-found' });
    setHeaderOption({ title: '분실물 찾기' });
  }, []);

  useEffect(() => {
    (async () => {
      const [data, error] = await ajax<any>({
        method: HttpMethod.GET,
        url: `lost-found/find/process/IN_PROGRESS`,
        errorCallback() {
          setLostItems([]);
        }
      });
      if (error) return;
      setLostItems(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const [data, error] = await ajax<any>({
        method: HttpMethod.GET,
        url: 'lost-found/find/process/FINISHED',
        errorCallback() {
          setFoundedItems([]);
        }
      });
      if (error) return;
      setFoundedItems(data);
    })();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>커뮤니티 - BSM</title>
      </Head>
      <div className={lostfoundStyle.category_list}>
        <div
          className={lostfoundStyle.category}
          style={{
            boxShadow: 'var(--shadow)',
            backgroundColor:
              category === 'IN_PROGRESS'
                ? theme === 'dark'
                  ? '#282828'
                  : '#FAFAFA'
                : theme === 'dark'
                ? '#383838'
                : '#EDEDED'
          }}
          onClick={() => setCategory('IN_PROGRESS')}
        >
          대기중
        </div>
        <div
          className={lostfoundStyle.category}
          style={{
            boxShadow: 'var(--shadow)',
            backgroundColor:
              category === 'FINISHED'
                ? theme === 'dark'
                  ? '#282828'
                  : '#FAFAFA'
                : theme === 'dark'
                ? '#383838'
                : '#EDEDED'
          }}
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
      <Link href={`/board/lostfound/write`} className={boardStyles.write}>
        <img src="/icons/pen.svg" alt="글쓰기" />
      </Link>
    </div>
  );
};

export default LostFound;
