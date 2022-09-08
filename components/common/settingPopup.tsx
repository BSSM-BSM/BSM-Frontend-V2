import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { screenScaleState, themeState } from "../../store/common.store";
import { ToggleButton } from "./buttons/toggleButton";
import { NumberInput } from "./inputs/numberInput";
import Modal from "./modal";

export const SettingBox = () => {
    const [theme, setTheme] = useRecoilState(themeState);
    const [screenScale, setScreenScale] = useRecoilState(screenScaleState);

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
            </ul>
        </Modal>
    );
}