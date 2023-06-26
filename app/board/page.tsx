'use client';

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { headerOptionState, pageState } from '@/store/common.store';
import { Banner, BannerPos } from '@/components/common/banner';
import { BannerType } from '@/types/banner.type';
import { useRouter } from 'next/navigation';
import { IoPeopleOutline, IoSchoolOutline } from 'react-icons/io5';
import { BiCodeAlt } from 'react-icons/bi';
import { AiOutlineBell } from 'react-icons/ai';

const BoardListPage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const router = useRouter();

  useEffect(() => {
    setHeaderOption({ title: '커뮤니티', headTitle: '커뮤니티 - BSM' });
    setPage({ id: 'board' });
  }, []);

  return (
    <div className="container _50">
      <>
        <Banner position={BannerPos.BOTTOM} type={BannerType.HORIZONTAL} />
      </>
      <ul className="list-wrap left">
        <li>
          <h3>모든 게시판 목록</h3>
          <ul className="list bold">
            <li className="pointer" onClick={() => router.push('/board/board')}>
              <IoPeopleOutline size="2.2rem" />
              <span>자유 게시판</span>
              <span>자유롭게 글을 쓸 수 있습니다</span>
            </li>
            <li className="pointer" onClick={() => router.push('/board/student')}>
              <IoSchoolOutline size="2.2rem" />
              <span>학생 게시판</span>
              <span>학생들만 이용할 수 있는 게시판</span>
            </li>
            <li className="pointer" onClick={() => router.push('/board/lostfound')}>
              <IoSchoolOutline size="2.2rem" />
              <span>분실물 찾기</span>
              <span>교내에서 잃어버린 분실물을 찾는 곳입니다</span>
            </li>
            <li className="pointer" onClick={() => router.push('/board/code')}>
              <BiCodeAlt size="2.2rem" />
              <span>코드 공유</span>
              <span>과제의 답을 공유해보세요</span>
            </li>
            <li className="pointer" onClick={() => router.push('/board/notice')}>
              <AiOutlineBell size="2.2rem" />
              <span>공지사항</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default BoardListPage;
