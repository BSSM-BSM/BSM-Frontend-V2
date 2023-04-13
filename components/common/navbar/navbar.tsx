import * as S from '@/styles/common/navbar.style';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineFastfood } from 'react-icons/md';
import { BsCalendar4 } from 'react-icons/bs';
import { IoExtensionPuzzleOutline, IoPeopleOutline } from 'react-icons/io5';
import NavbarItem from '@/components/common/navbar/navbarItem';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { pageState } from '@/store/common.store';

const Navbar = () => {
  const router = useRouter();
  const _page = useRecoilValue(pageState); // 페이지 이동 감지용 state

  return (
    <S.Navbar>
      <S.NavbarItemList>
        <NavbarItem
          id='timetable'
          Icon={BsCalendar4}
          iconSize={20}
          onClick={() => router.push('/timetable')}
        >
          시간표
        </NavbarItem>
        <NavbarItem
          id='meister'
          Icon={AiOutlineUser}
          iconSize={26}
          onClick={() => router.push('/meister')}
        >
          역량 인증제
        </NavbarItem>
        <NavbarItem
          id='meal'
          Icon={MdOutlineFastfood}
          iconSize={22}
          onClick={() => router.push('/meal')}
        >
          급식
        </NavbarItem>
        <NavbarItem
          id='board'
          Icon={IoPeopleOutline}
          iconSize={26}
          onClick={() => router.push('/board')}
        >
          커뮤니티
        </NavbarItem>
        <NavbarItem
          id='service'
          Icon={IoExtensionPuzzleOutline}
          iconSize={26}
          onClick={() => router.push('/service')}
        >
          모든 서비스
        </NavbarItem>
      </S.NavbarItemList>
    </S.Navbar>
  );
}

export default Navbar;
