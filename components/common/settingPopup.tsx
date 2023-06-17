import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAjax } from "@/hooks/useAjax";
import { useModal } from "@/hooks/useModal";
import { useOverlay } from "@/hooks/useOverlay";
import { userState } from "@/store/account.store";
import { boardAnonymousModeState, boardDetailTimeState, boardOpenAllChildCommentsState, postLimitState } from "@/store/setting/board.store";
import { customBackgroundOnlyHomeState, pushSubscriptionState, screenScaleState, themeState } from "@/store/common.store";
import { subscribe, unsubscribe } from "@/utils/webPush";
import { ToggleButton } from "@/components/common/buttons/toggleButton";
import { NumberInput } from "@/components/common/inputs/numberInput";
import Modal from "@/components/common/modal";

export const SettingBox = () => {
  const { ajax } = useAjax();
  const { showToast } = useOverlay();
  const [user] = useRecoilState(userState);
  const { openModal } = useModal();
  const [pushSubscription, setPushSubscription] = useRecoilState(pushSubscriptionState);
  const [theme, setTheme] = useRecoilState(themeState);
  const [screenScale, setScreenScale] = useRecoilState(screenScaleState);
  const [postLimit, setPostLimit] = useRecoilState(postLimitState);
  const [boardDetailTime, setBoardDetailTime] = useRecoilState(boardDetailTimeState);
  const [boardAnonymousMode, setBoardAnonymousMode] = useRecoilState(boardAnonymousModeState);
  const [boardOpenAllChildComments, setBoardOpenAllChildComments] = useRecoilState(boardOpenAllChildCommentsState);
  const [customBackgroundOnlyHome, setCustomBackgroundOnlyHome] = useRecoilState(customBackgroundOnlyHomeState);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--scale', `${screenScale * 0.625}%`);
  }, [screenScale]);

  const adminMenu = () => {
    if (!user.isLogin || user.level < 1) return (<></>);
    return (<li>
      <h3>관리자 메뉴</h3>
      <ul className='list'>
        <li className='pointer' onClick={() => openModal('emoticon_manage_box')}>
          <span>이모티콘 관리</span>
          <span>커뮤니티 페이지</span>
        </li>
      </ul>
    </li>);
  }

  return (
    <Modal type="main" id="setting" title="설정">
      <ul className='list-wrap left'>
        {adminMenu()}
        <li>
          <h3>모양</h3>
          <ul className='list'>
            <li className='toggle'>
              <span>다크 모드</span>
              <ToggleButton
                onCallback={() => {setTheme('dark')}}
                offCallback={() => {setTheme('white')}}
                value={theme === 'dark'}
              />
            </li>
            <li className='toggle'>
              <span>홈에만 커스텀 백그라운드 이미지 적용</span>
              <ToggleButton
                onCallback={() => {setCustomBackgroundOnlyHome(true)}}
                offCallback={() => {setCustomBackgroundOnlyHome(false)}}
                value={customBackgroundOnlyHome}
              />
            </li>
            <li className='picker'>
              <span>배율</span>
              <NumberInput
                setCallback={setScreenScale}
                initial={screenScale}
                min={50}
                max={500}
                msg='%'
              />
            </li>
          </ul>
        </li>
        <li>
          <h3>기타</h3>
          <ul className='list'>
            <li className='toggle'>
              <span>알림</span>
              <span>급식 알림 등을 받을 수 있습니다</span>
              <ToggleButton
                offCallback={() => unsubscribe(ajax, setPushSubscription, showToast)}
                onCallback={() => subscribe(ajax, setPushSubscription, showToast)}
                value={pushSubscription !== null}
              />
            </li>
          </ul>
        </li>
        <li>
          <h3>커뮤니티</h3>
          <ul className='list'>
            <li className='toggle'>
              <span>익명 모드</span>
              <span>댓글 및 글쓰기시 익명으로 작성</span>
              <ToggleButton
                onCallback={() => setBoardAnonymousMode(true)}
                offCallback={() => setBoardAnonymousMode(false)}
                value={boardAnonymousMode}
              />
            </li>
            <li className='picker'>
              <span>한 번에 불러올 게시글 개수</span>
              <NumberInput
                setCallback={setPostLimit}
                initial={postLimit}
                min={10}
                max={100}
                msg='개'
              />
            </li>
            <li className='toggle'>
              <span>게시글 및 댓글 자세한 시간</span>
              <ToggleButton
                onCallback={() => setBoardDetailTime(true)}
                offCallback={() => setBoardDetailTime(false)}
                value={boardDetailTime}
              />
            </li>
            <li className='toggle'>
              <span>모든 대댓글 표시</span>
              <span>대댓글이 너무 깊을 수 있습니다</span>
              <ToggleButton
                onCallback={() => setBoardOpenAllChildComments(true)}
                offCallback={() => setBoardOpenAllChildComments(false)}
                value={boardOpenAllChildComments}
              />
            </li>
          </ul>
        </li>
      </ul>
    </Modal>
  );
}