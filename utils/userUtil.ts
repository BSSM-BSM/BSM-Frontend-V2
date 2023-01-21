import { SetterOrUpdater } from "recoil";
import { Ajax, HttpMethod } from "../hooks/useAjax";
import { NoLoginUser, Student, Teacher } from "../types/user.type";
import { StaticImageData } from 'next/image';
import DefaultProfilePic from '../public/icons/profile_default.png';


export const getUserInfo = async (ajax: Ajax, setUser: SetterOrUpdater<NoLoginUser| Student| Teacher>) => {
    localStorage.removeItem('user');
    const [data, error] = await ajax<Student | Teacher>({
        method: HttpMethod.GET,
        url: 'user',
        errorCallback(data) {
            if (data && 'statusCode' in data && data.statusCode === 401) {
                return true;
            }
        },
    });
    if (error) return;

    const userInfo: (Student| Teacher) = {...data, isLogin: true};
    setUser(userInfo);
    return userInfo;
}

export const getProfileSrc = (userCode: number): string | StaticImageData => 
    userCode > 0
    ? `https://auth.bssm.kro.kr/resource/user/profile/${userCode}.png`
    : DefaultProfilePic;