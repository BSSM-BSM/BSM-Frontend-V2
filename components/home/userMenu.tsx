import styles from '../../styles/home.module.css';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../store/account.store";
import { UserRole } from "../../types/userType";
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import { useModal } from '../../hooks/useModal';
import { getProfileSrc } from '../../utils/userUtil';

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
        setProfileSrc(getProfileSrc(user.isLogin? user.code: 0));
    }, [user]);

    return (
        mounted && user.isLogin
        ? <a className={styles.menu} href='https://auth.bssm.kro.kr/user'>
            <div className={`${styles.user_icon} user-profile`}>
                <Image
                    src={profileSrc}
                    onError={() => setProfileSrc(DefaultProfilePic)}
                    width='128px'
                    height='128px'
                    alt='user profile'
                />
            </div>
            <div>
                <div className={styles.sub_content}>
                    {
                        user.role === UserRole.STUDENT
                        ? `${user.student.grade}학년 ${user.student.classNo}반 ${user.student.studentNo}번 ${user.student?.name}`
                        : `${user.teacher?.name} 선생님`
                    }
                </div>
                <div className={styles.main_content}>{user.nickname}</div>
            </div>
        </a>
        : <div className={styles.menu} onClick={() => openModal('login')}>
            <img className={styles.icon} src='/icons/person.svg' alt='login' />
            <span>로그인</span>
        </div>
    );
}