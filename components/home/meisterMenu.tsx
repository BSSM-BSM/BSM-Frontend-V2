import styles from '../../styles/home.module.css';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { useModal } from "../../hooks/useModal";
import { userState } from "../../store/account.store";
import { HomeMenuMeisterInfo } from "../../types/meisterType";
import { UserRole } from "../../types/userType";
import Modal from "../common/modal";
import { elapsedTime } from '../../utils/date';

export const MeisterHomeMenu = () => {
    const [user] = useRecoilState(userState);
    const [meisterInfo, setMeisterInfo] = useState<HomeMenuMeisterInfo>({
        isLoading: true,
        lastUpdate: '',
        error: false
    });
    const { openModal } = useModal();
    const { ajax } = useAjax();

    useEffect(() => {
        loadMeisterInfo();
    }, [user]);

    const loadMeisterInfo = async (type?: string) => {
        setMeisterInfo({
            isLoading: true,
            lastUpdate: '',
            error: false
        });

        if (user.isLogin && user.role !== UserRole.STUDENT) {
            return setMeisterInfo({
                isLoading: false,
                lastUpdate: new Date().toString(),
                error: 'notStudent'
            });
        }
        
        const [data, error] = await ajax<HomeMenuMeisterInfo>({
            url: `meister${type === 'update'? '/update': ''}`,
            method: HttpMethod.GET,
            errorCallback(data) {
                if (typeof data === 'object' && 'statusCode' in data && data.statusCode === 401) {
                    setMeisterInfo({
                        isLoading: false,
                        lastUpdate: new Date().toString(),
                        error: 'auth'
                    });
                    return true;
                }
                setMeisterInfo({
                    isLoading: false,
                    lastUpdate: new Date().toString(),
                    error: 'unknown'
                });
                return false;
            },
        });
        if (error) return;

        setMeisterInfo({
            ...data,
            isLoading: false,
            error: data.loginError? 'login': false
        });
    }

    const meisterInfoView = () => {
        const { isLoading, error, score, positivePoint, negativePoint } = meisterInfo;

        if (isLoading) return '?????????';
        if (error === 'auth') return '???????????? ?????? ???????????????';
        if (error === 'notStudent') return '????????? ?????? ???????????????';
        if (error === 'login') return (
            <>
                <span>????????? ???????????? ????????? ??? ????????????</span>
                <span onClick={e => {
                    e.preventDefault();
                    openModal('meister_login_error');
                }}>?????? ??????</span>
            </>
        );
        if (error) return '??? ??? ?????? ????????? ?????????????????????';
        return `${score}??? / ??????: ${positivePoint} ??????: ${negativePoint}`;
    }

    return (
        <>
            <Link href='/meister'>
                <a className={`${styles.menu} ${styles.meister}`}>
                    <img className={styles.icon} src='/icons/person.svg' alt='meister'></img>
                    <div>
                        <div className={styles.sub_content}>
                            <span>
                                ?????? / ?????????
                            </span>
                            <span className={styles.meister_info} onClick={e => {
                                e.preventDefault();
                                loadMeisterInfo('update');
                            }}>
                                {!meisterInfo.isLoading && `Update: ${elapsedTime(meisterInfo.lastUpdate)}`}
                                {!meisterInfo.isLoading && <img className={`${styles.icon} ${styles.refresh}`} src='/icons/refresh.svg' alt='refresh'></img>}
                            </span>
                        </div>
                        <div className={styles.main_content}>{meisterInfoView()}</div>
                    </div>
                </a>
            </Link>
            <Modal type="main" id="meister_login_error" title="?????? ??????">
                <div>
                    <a href="https://bssm.meistergo.co.kr" className='accent-text'>???????????? ?????? ????????? ?????????</a><span>??? ??????????????? ?????? ??????????????? ???????????? ??? ?????? ???????????? ????????????</span>
                    <br />
                    <br />
                    <details>
                        {meisterInfo.uniqNo}
                        <summary>?????? ???????????? ??????</summary>
                    </details>
                </div>
            </Modal>
        </>
    );
}