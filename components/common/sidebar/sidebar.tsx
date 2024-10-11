import * as S from '@/styles/common/sidebar.style';
import { AiFillGithub, AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { MdOutlineFastfood } from 'react-icons/md';
import { BsBox2, BsCalendar4 } from 'react-icons/bs';
import { IoExtensionPuzzleOutline, IoPeopleOutline, IoSchoolOutline } from 'react-icons/io5';
import { BiCodeAlt } from 'react-icons/bi';
import { AiOutlineBell } from 'react-icons/ai';
import SidebarItem from '@/components/common/sidebar/sidebarItem';
import SidebarUserMenu from '@/components/common/sidebar/sidebarUserMenu';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { pageState, sideBarState } from '@/store/common.store';
import SidebarServiceMenu from '@/components/common/sidebar/sidebarServiceMenu';
import { FaSchool } from 'react-icons/fa';
import React from 'react';

const Sidebar = () => {
  const router = useRouter();
  const _page = useRecoilValue(pageState); // 페이지 이동 감지용 state
  const sideBar = useRecoilValue(sideBarState);

  const boardDropdownMenu = (
    <>
      <SidebarItem
        id="board"
        subId="board"
        Icon={IoPeopleOutline}
        iconSize="2.6rem"
        onClick={() => router.push('/board/board')}
        order={1}
      >
        자유 게시판
      </SidebarItem>
      <SidebarItem
        id="board"
        subId="student"
        Icon={IoSchoolOutline}
        iconSize="2.6rem"
        onClick={() => router.push('/board/student')}
        order={2}
      >
        학생 게시판
      </SidebarItem>
      <SidebarItem
        id="board"
        subId="lost-found"
        Icon={BsBox2}
        iconSize="2rem"
        onClick={() => router.push('/board/lostfound')}
        order={3}
      >
        분실물 찾기
      </SidebarItem>
      <SidebarItem
        id="board"
        subId="code"
        Icon={BiCodeAlt}
        iconSize="2.6rem"
        onClick={() => router.push('/board/code')}
        order={4}
      >
        코드 공유
      </SidebarItem>
      <SidebarItem
        id="board"
        subId="notice"
        Icon={AiOutlineBell}
        iconSize="2.6rem"
        onClick={() => router.push('/board/notice')}
        order={5}
      >
        공지사항
      </SidebarItem>
    </>
  );

  return (
    <S.Sidebar isOpen={sideBar} className="scroll-bar">
      <S.SidebarItemList>
        <SidebarUserMenu />
        <SidebarItem id="home" Icon={AiOutlineHome} iconSize="2.2rem" onClick={() => router.push('/')}>
          메인
        </SidebarItem>
        <SidebarItem id="meal" Icon={MdOutlineFastfood} iconSize="2.2rem" onClick={() => router.push('/meal')}>
          급식
        </SidebarItem>
        <SidebarItem id="meister" Icon={AiOutlineUser} iconSize="2.6rem" onClick={() => router.push('/meister')}>
          마이스터 역량 인증제
        </SidebarItem>
        <SidebarItem id="timetable" Icon={BsCalendar4} iconSize="2.2rem" onClick={() => router.push('/timetable')}>
          시간표
        </SidebarItem>
        <SidebarItem
          id="board"
          Icon={IoPeopleOutline}
          iconSize="2.6rem"
          dropdownMenu={boardDropdownMenu}
          dropdownInitialOpen={true}
        >
          커뮤니티
        </SidebarItem>
        <SidebarServiceMenu />
        <SidebarItem
          Icon={AiFillGithub}
          iconSize="2.6rem"
          onClick={() => window.open('https://github.com/BSSM-BSM', '_blank')}
        >
          깃허브
        </SidebarItem>
        <SidebarItem
          Icon={FaSchool}
          iconSize="2.6rem"
          onClick={() => window.open('https://school.busanedu.net/bssm-h/main.do', '_blank')}
          order={1}
        >
          학교 홈페이지
        </SidebarItem>
      </S.SidebarItemList>
    </S.Sidebar>
  );
};

export default Sidebar;
