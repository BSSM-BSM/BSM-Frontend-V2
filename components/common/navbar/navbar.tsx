import * as S from '../../../styles/common/navbar.style';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineFastfood } from 'react-icons/md';
import { BsCalendar4 } from 'react-icons/bs';
import { IoPeopleOutline, IoSchoolOutline } from 'react-icons/io5';
import { BiCodeAlt } from 'react-icons/bi';
import { AiOutlineBell } from 'react-icons/ai';
import NavbarItem from './navbarItem';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { pageState } from '../../../store/common.store';

const Navbar = () => {
  const router = useRouter();
  const _page = useRecoilValue(pageState);

  return (
    <S.Navbar>
      <S.NavbarItemList>
        <NavbarItem
          id='meal'
          Icon={MdOutlineFastfood}
          iconSize={22}
          onClick={() => router.push('/meal')}
        >
          급식
        </NavbarItem>
        <NavbarItem
          id='meister'
          Icon={AiOutlineUser}
          iconSize={26}
          onClick={() => router.push('/meister')}
        >
          마이스터 인증제
        </NavbarItem>
        <NavbarItem
          id='timetable'
          Icon={BsCalendar4}
          iconSize={22}
          onClick={() => router.push('/timetable')}
        >
          시간표
        </NavbarItem>
        <NavbarItem
          id='board'
          Icon={IoPeopleOutline}
          iconSize={26}
          onClick={() => router.push('/board/board')}
        >
          커뮤니티
        </NavbarItem>
      </S.NavbarItemList>
    </S.Navbar>
  );
}

export default Navbar;
