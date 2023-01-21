import * as S from '../../../styles/common/sidebar.style';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../../store/account.store";
import { UserRole } from "../../../types/user.type";
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '../../../public/icons/profile_default.png';
import { useModal } from '../../../hooks/useModal';
import { getProfileSrc } from '../../../utils/userUtil';
import SidebarItem from './sidebarItem';
import { AiOutlineUser } from 'react-icons/ai';

const SidebarUserMenu = () => {
  const { openModal } = useModal();
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);
  const [user] = useRecoilState(userState);

  useEffect(() => {
      setProfileSrc(getProfileSrc(user.isLogin? user.code: 0));
  }, [user]);

  return (
    user.isLogin
    ? (
      <SidebarItem
        onClick={() => window.open('https://auth.bssm.kro.kr/user', '_blank')}
        IconElement={
          <S.SidebarUserProfile>
            <Image
              src={profileSrc}
              onError={() => setProfileSrc(DefaultProfilePic)}
              alt='user profile'
              fill
            />
          </S.SidebarUserProfile>
        }
      >
        <div>
          <S.SidebarUserInfo>{
            user.role === UserRole.STUDENT
            ? `${user.student.grade}학년 ${user.student.classNo}반 ${user.student.studentNo}번 ${user.student?.name}`
            : `${user.teacher?.name} 선생님`
          }</S.SidebarUserInfo>
          <S.SidebarUserName>{user.nickname}</S.SidebarUserName>
        </div>
      </SidebarItem>
    )
    : (
      <SidebarItem
        Icon={AiOutlineUser}
        iconSize={26}
        onClick={() => openModal('login')}
      >
        로그인
      </SidebarItem>
    )
  );
}

export default SidebarUserMenu;