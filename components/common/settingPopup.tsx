import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { boardDetailTimeState, postLimitState } from "../../store/board.store";
import { screenScaleState, themeState } from "../../store/common.store";
import { ToggleButton } from "./buttons/toggleButton";
import { NumberInput } from "./inputs/numberInput";
import Modal from "./modal";

export const SettingBox = () => {
    const [theme, setTheme] = useRecoilState(themeState);
    const [screenScale, setScreenScale] = useRecoilState(screenScaleState);
    const [postLimit, setPostLimit] = useRecoilState(postLimitState);
    const [boardDetailTime, setBoardDetailTime] = useRecoilState(boardDetailTimeState);

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

    return (
        <Modal type="main" id="setting" title="설정">
            <ul className='list-wrap left'>
                <li>
                    <h3>모양</h3>
                    <ul className='list'>
                        <li className="toggle">
                            <span>다크 모드</span>
                            <ToggleButton
                                onCallback={
                                    () => {
                                        setTheme('dark');
                                        localStorage.setItem('theme', 'dark');
                                    }
                                }
                                offCallback={
                                    () => {
                                        setTheme('white');
                                        localStorage.setItem('theme', 'white');
                                    }
                                }
                                initial={theme === 'dark'}
                            />
                        </li>
                        <li className='picker'>
                            <span>배율</span>
                            <div className="rows">
                                <NumberInput
                                    setCallback={setScreenScale}
                                    initial={screenScale}
                                    min={50}
                                    max={500}
                                />
                                <span>%</span>
                            </div>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>커뮤니티</h3>
                    <ul className='list'>
                        <li className='picker'>
                            <span>한 번에 불러올 게시글 개수</span>
                            <div className="rows">
                                <NumberInput
                                    setCallback={setPostLimit}
                                    initial={postLimit}
                                    min={10}
                                    max={100}
                                />
                                <span>개</span>
                            </div>
                        </li>
                        <li className="toggle">
                            <span>게시글 및 댓글 자세한 시간</span>
                            <ToggleButton
                                onCallback={() => setBoardDetailTime(true)}
                                offCallback={() => setBoardDetailTime(false)}
                                initial={boardDetailTime}
                            />
                        </li>
                    </ul>
                </li>
            </ul>
        </Modal>
    );
}