import { SetterOrUpdater } from "recoil";
import { Ajax, HttpMethod } from "../hooks/useAjax";
import { NoLoginUser, Student, Teacher } from "../types/userType";

export const getUserInfo = async (ajax: Ajax, setUser: SetterOrUpdater<NoLoginUser| Student| Teacher>) => {
    localStorage.removeItem('user');
    const [data, error] = await ajax<Student | Teacher>({
        method: HttpMethod.GET,
        url: 'user',
    });
    if (error) return;

    const userInfo: (Student| Teacher) = {...data, isLogin: true};
    setUser(userInfo);
    return userInfo;
}