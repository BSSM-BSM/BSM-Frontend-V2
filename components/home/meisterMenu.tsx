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

        if (isLoading) return '로딩중';
        if (error === 'auth') return '로그인후 이용 가능합니다';
        if (error === 'notStudent') return '학생만 이용 가능합니다';
        if (error === 'login') return (
            <>
                <span>정보를 자동으로 불러올 수 없습니다</span>
                <span onClick={e => {
                    e.preventDefault();
                    openModal('meister_login_error');
                }}>해결 방법</span>
            </>
        );
        if (error) return '알 수 없는 에러가 발생하였습니다';
        return `${score}점 / 상점: ${positivePoint} 벌점: ${negativePoint}`;
    }

    return (
        <>
            <Link href='/meister'>
                <a className={`${styles.menu} ${styles.meister}`}>
                    <img className={styles.icon} src='/icons/person.svg' alt='meister'></img>
                    <div>
                        <div className={styles.sub_content}>
                            <span>
                                점수 / 상벌점
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
            <Modal type="main" id="meister_login_error" title="해결 방법">
                <div>
                    <a href="https://bssm.meistergo.co.kr" className='accent-text'>마이스터 역량 인증제 사이트</a><span>의 비밀번호를 초기 비밀번호로 재설정한 뒤 다시 새로고침 해주세요</span>
                    <br />
                    <br />
                    <details>
                        {meisterInfo.uniqNo}
                        <summary>초기 비밀번호 보기</summary>
                    </details>
                </div>
            </Modal>
        </>
    );
}