import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/store/account.store";
import { UserRole } from "@/types/user.type";
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '@/public/icons/profile_default.png';
import { useModal } from '@/hooks/useModal';
import { getProfileSrc } from '@/utils/userUtil';
import * as S from '@/styles/home.style';

export const UserHomeMenu = () => {
  const [mounted, setMounted] = useState(false);
  const { openModal } = useModal();
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);
  const [user] = useRecoilState(userState);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setProfileSrc(getProfileSrc(user.isLogin ? user.code : 0));
  }, [user]);

  return (
    mounted && user.isLogin
      ? <S.LoginUserMenu href='https://auth.bssm.kro.kr/user'>
        <S.UserProfile>
          <Image
            src={profileSrc}
            onError={() => setProfileSrc(DefaultProfilePic)}
            width='128'
            height='128'
            alt='user profile'
          />
        </S.UserProfile>
        <div>
          <h5>
            {
              user.role === UserRole.STUDENT
                ? `${user.student.grade}학년 ${user.student.classNo}반 ${user.student.studentNo}번 ${user.student?.name}`
                : `${user.teacher?.name} 선생님`
            }
          </h5>
          <h4>{user.nickname}</h4>
        </div>
      </S.LoginUserMenu>
      : <S.NoLoginUserMenu onClick={() => openModal('login')}>
        <img src='/icons/person.svg' alt='login' />
        <span>로그인</span>
      </S.NoLoginUserMenu>
  );
}