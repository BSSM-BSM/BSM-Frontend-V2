import * as S from '../../../styles/common/sidebar.style';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineFastfood } from 'react-icons/md';
import { BsCalendar4 } from 'react-icons/bs';
import { IoPeopleOutline, IoSchoolOutline } from 'react-icons/io5';
import { BiCodeAlt } from 'react-icons/bi';
import { AiOutlineBell } from 'react-icons/ai';
import SidebarItem from './sidebarItem';
import SidebarUserMenu from './sidebarUserMenu';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  return (
    <S.Sidebar>
      <S.SidebarItemList>
        <SidebarUserMenu />
        <SidebarItem
          Icon={MdOutlineFastfood}
          iconSize={22}
          onClick={() => router.push('/meal')}
        >
          급식
        </SidebarItem>
        <SidebarItem
          Icon={AiOutlineUser}
          iconSize={26}
          onClick={() => router.push('/meister')}
        >
          마이스터 역량 인증제
        </SidebarItem>
        <SidebarItem
          Icon={BsCalendar4}
          iconSize={22}
          onClick={() => router.push('/timetable')}
        >
          시간표
        </SidebarItem>
        <SidebarItem
          Icon={IoPeopleOutline}
          iconSize={26}
          onClick={() => router.push('/board/board')}
        >
          자유 게시판
        </SidebarItem>
        <SidebarItem
          Icon={IoSchoolOutline}
          iconSize={26}
          onClick={() => router.push('/board/student')}
        >
          학생 게시판
        </SidebarItem>
        <SidebarItem
          Icon={BiCodeAlt}
          iconSize={26}
          onClick={() => router.push('/board/code')}
        >
          코드 공유
        </SidebarItem>
        <SidebarItem
          Icon={AiOutlineBell}
          iconSize={26}
          onClick={() => router.push('/board/notice')}
        >
          공지사항
        </SidebarItem>
      </S.SidebarItemList>
    </S.Sidebar>
  );
}

export default Sidebar;
