'use client';

import 'prismjs/plugins/toolbar/prism-toolbar.min';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/toolbar/prism-toolbar.min.css';
import styles from '@/styles/board/post/post.module.css';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { headerOptionState, pageState } from '@/store/common.store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Head from 'next/head';
import { UserInfoLink } from '@/components/board/userInfoLink';
import { postXssFilter } from '@/components/board/post/postView';
import { userState } from '@/store/account.store';

interface LostFoundDetailProps {
  params: {
    id: number;
  };
}

const LostFoundDetail = ({ params: { id } }: LostFoundDetailProps) => {
  const { ajax } = useAjax();
  const user = useRecoilValue(userState);
  const [detail, setDetail] = useState({
    id: -1,
    objectName: '',
    imgSrc: '',
    location: '',
    findDateTime: '',
    description: '',
    process: 'IN_PROGRESS',
    foundUser: {
      id: -1,
      nickname: ''
    }
  });
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);

  useEffect(() => {
    setPage({ id: 'board', subId: 'lost-found' });
  }, []);

  useEffect(() => {
    (async () => {
      const [data, error] = await ajax<any>({
        method: HttpMethod.GET,
        url: `lost-found/find/${id}`
      });
      setDetail(data);
      setHeaderOption({ title: data.objectName });
    })();
  }, []);

  const onClickProcessDone = async () => {
    const [data, error] = await ajax<any>({
      method: HttpMethod.PUT,
      url: `lost-found/def/update/${id}`,
      payload: {
        process: 'FINISHED'
      }
    });
    setDetail(data);
  };

  return (
    <div className="container _110">
      <Head>
        <title>{detail?.objectName} - 커뮤니티 - BSM</title>
      </Head>
      <div style={{ marginTop: '4vw' }} className={styles.post_wrap}>
        <div className={styles.post_info}>
          <div className="cols space-between flex-main">
            <h2 className={styles.title}>{detail?.objectName}</h2>
            <div className="rows space-between">
              <span className="bold">
                <UserInfoLink userId={detail.foundUser.id} nickname={detail.foundUser.nickname} />
              </span>
            </div>
            <br />
            <div className="rows space-between">
              <span>보관 장소 : {detail.location}</span>
            </div>
            <div className="rows space-between">
              <span>습득 날짜 : {new Date(detail.findDateTime).toLocaleString()}</span>
            </div>
            <div className="rows space-between">
              <span>물품 상태 : {detail.process === 'FINISHED' ? '수령 완료' : '수령 대기중'}</span>
            </div>
            {detail.process !== 'FINISHED' && user.isLogin && user.id === detail.foundUser.id && (
              <button style={{ padding: '10px' }} onClick={onClickProcessDone}>
                수령 완료 처리하기
              </button>
            )}
          </div>
        </div>
        <div
          className={styles.post_content}
          dangerouslySetInnerHTML={{ __html: postXssFilter.process(detail.description) }}
        />
        <img src={detail.imgSrc} />
      </div>
      <div className={styles.like_wrap}></div>
    </div>
  );
};

export default LostFoundDetail;
