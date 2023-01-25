import * as S from '../../../styles/common/sidebar.style';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineFastfood } from 'react-icons/md';
import { BsCalendar4 } from 'react-icons/bs';
import { IoExtensionPuzzleOutline, IoPeopleOutline, IoSchoolOutline } from 'react-icons/io5';
import { BiCodeAlt } from 'react-icons/bi';
import { AiOutlineBell } from 'react-icons/ai';
import SidebarItem from './sidebarItem';
import SidebarUserMenu from './sidebarUserMenu';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { pageState } from '../../../store/common.store';

const Sidebar = () => {
  const router = useRouter();
  const _page = useRecoilValue(pageState);

  return (
    <S.Sidebar>
      <S.SidebarItemList>
        <SidebarUserMenu />
        <SidebarItem
          id='meal'
          Icon={MdOutlineFastfood}
          iconSize={22}
          onClick={() => router.push('/meal')}
        >
          급식
        </SidebarItem>
        <SidebarItem
          id='meister'
          Icon={AiOutlineUser}
          iconSize={26}
          onClick={() => router.push('/meister')}
        >
          마이스터 역량 인증제
        </SidebarItem>
        <SidebarItem
          id='timetable'
          Icon={BsCalendar4}
          iconSize={22}
          onClick={() => router.push('/timetable')}
        >
          시간표
        </SidebarItem>
        <SidebarItem
          id='board'
          subId='board'
          Icon={IoPeopleOutline}
          iconSize={26}
          onClick={() => router.push('/board/board')}
        >
          자유 게시판
        </SidebarItem>
        <SidebarItem
          id='board'
          subId='student'
          Icon={IoSchoolOutline}
          iconSize={26}
          onClick={() => router.push('/board/student')}
        >
          학생 게시판
        </SidebarItem>
        <SidebarItem
          id='board'
          subId='code'
          Icon={BiCodeAlt}
          iconSize={26}
          onClick={() => router.push('/board/code')}
        >
          코드 공유
        </SidebarItem>
        <SidebarItem
          id='board'
          subId='notice'
          Icon={AiOutlineBell}
          iconSize={26}
          onClick={() => router.push('/board/notice')}
        >
          공지사항
        </SidebarItem>
        <SidebarItem
          id='service'
          Icon={IoExtensionPuzzleOutline}
          iconSize={26}
          onClick={() => router.push('/service')}
        >
          모든 서비스
        </SidebarItem>
      </S.SidebarItemList>
    </S.Sidebar>
  );
}

export default Sidebar;
