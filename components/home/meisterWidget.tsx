import styles from '@/styles/home.module.css';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { useModal } from '@/hooks/useModal';
import { userState } from '@/store/account.store';
import { HomeWidgetMeisterInfo } from '@/types/meister.type';
import Modal from '@/components/common/modal';
import { elapsedTime } from '@/utils/date';
import * as S from '@/styles/home.style';
import { AiOutlineUser } from 'react-icons/ai';
import { TbRefresh } from 'react-icons/tb';

const meisterActivated = true;

export const MeisterHomeWidget = () => {
  const [user] = useRecoilState(userState);
  const [meisterInfo, setMeisterInfo] = useState<HomeWidgetMeisterInfo>({
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
    if (!meisterActivated) return;

    setMeisterInfo({
      isLoading: true,
      lastUpdate: '',
      error: false
    });

    const [data, error] = await ajax<HomeWidgetMeisterInfo>({
      url: `meister${type === 'update' ? '/update' : ''}`,
      method: HttpMethod.GET,
      errorCallback(data) {
        if (typeof data !== 'object' || !('statusCode' in data)) {
          setMeisterInfo({
            isLoading: false,
            lastUpdate: new Date().toString(),
            error: 'unknown'
          });
          return false;
        }
        if (data.statusCode === 401) {
          setMeisterInfo({
            isLoading: false,
            lastUpdate: new Date().toString(),
            error: 'auth'
          });
          return true;
        }
        if (data.statusCode === 403) {
          setMeisterInfo({
            isLoading: false,
            lastUpdate: new Date().toString(),
            error: 'notStudent'
          });
          return true;
        }
        setMeisterInfo({
          isLoading: false,
          lastUpdate: new Date().toString(),
          error: 'unknown'
        });
      }
    });
    if (error) return;

    setMeisterInfo({
      ...data,
      isLoading: false,
      error: data.loginError ? 'login' : false
    });
  };

  const meisterInfoView = () => {
    const { isLoading, error, score, positivePoint, negativePoint } = meisterInfo;

    if (!meisterActivated) {
      return (
        <>
          <span>마이스터 역량인증제가 비활성화됨</span>
          <span
            onClick={e => {
              e.preventDefault();
              openModal('meister_inactivated');
            }}
          >
            자세히 보기
          </span>
        </>
      );
    }
    if (isLoading) return '로딩중';
    if (error === 'auth') return '로그인후 이용 가능합니다';
    if (error === 'notStudent') return '학생만 이용 가능합니다';
    if (error === 'login')
      return (
        <>
          <span>정보를 자동으로 불러올 수 없습니다</span>
          <span
            onClick={e => {
              e.preventDefault();
              openModal('meister_login_error');
            }}
          >
            해결 방법
          </span>
        </>
      );
    if (error) return '알 수 없는 에러가 발생하였습니다';
    return `${score}점 / 상점: ${positivePoint} 벌점: ${negativePoint}`;
  };

  return (
    <>
      <S.MeisterWidget href="/meister">
        <AiOutlineUser size="3rem" />
        <div>
          <h5>
            <span>점수 / 상벌점</span>
            <span
              onClick={e => {
                e.preventDefault();
                loadMeisterInfo('update');
              }}
            >
              {!meisterInfo.isLoading && (
                <>
                  Update: {elapsedTime(meisterInfo.lastUpdate)}
                  <TbRefresh size='1.8rem' />
                </>
              )}
            </span>
          </h5>
          <h4 className={styles.main_content}>{meisterInfoView()}</h4>
        </div>
      </S.MeisterWidget>
      <Modal type="main" id="meister_login_error" title="해결 방법">
        <div>
          <a href="https://bssm.meistergo.co.kr" className="accent-text">
            마이스터 역량 인증제 사이트
          </a>
          <span>의 비밀번호를 초기 비밀번호로 재설정한 뒤 다시 새로고침 해주세요</span>
          <br />
          <br />
          <details>
            {meisterInfo.uniqNo}
            <summary>초기 비밀번호 보기</summary>
          </details>
        </div>
      </Modal>
      <Modal type="main" id="meister_inactivated" title="마이스터 역량인증제">
        <div>
          <p>아직 마이스터 역량인증제의 {new Date().getFullYear()}년 버전이 오픈하지 않았습니다.</p>
          <span>자세한 내용은 </span>
          <a href="https://bssm.meistergo.co.kr" className="accent-text">
            마이스터 역량 인증제 사이트
          </a>
          <span>를 확인해주세요.</span>
        </div>
      </Modal>
    </>
  );
};
