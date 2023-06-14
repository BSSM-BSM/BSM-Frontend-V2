import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { boardAndPostIdState, postOpenState, postState } from '@/store/board.store';
import styles from '@/styles/board/board.module.css';
import { Category, DetailPost, Post } from '@/types/board.type';
import DefaultProfilePic from '@/public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { UserInfoLink } from '@/components/board/userInfoLink';
import { elapsedTime, MilliSecondTime } from '@/utils/date';
import { getProfileSrc } from '@/utils/userUtil';

export const LostFoundItem = ({
  id,
  objectName,
  imgSrc,
  process
}: {
  id: number;
  objectName: string;
  imgSrc: string;
  process: string;
}) => {
  return (
    <li className={styles.post_item_wrap}>
      <div
        className={styles.post_item}
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className={styles.total_comments}>
          <img src={imgSrc} alt="" style={{ width: '40px', height: '40px' }} />
        </div>
        <div
          className="flex-main cols gap-05"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row'
          }}
        >
          <Link
            href={`/board/lostfound/${id}`}
            className={styles.post_title}
            style={{
              marginLeft: '8px',
              marginRight: 'auto'
            }}
          >
            {objectName}
          </Link>
          <div
            style={{
              marginTop: '5px',
              color: 'white',
              fontSize: '15px',
              marginLeft: '53vw',
              position: 'absolute',
              marginRight: 'auto'
            }}
          >
            {process === 'FINISHED' ? '수령 완료' : '수령 대기중'}
          </div>
        </div>
      </div>
    </li>
  );
};
