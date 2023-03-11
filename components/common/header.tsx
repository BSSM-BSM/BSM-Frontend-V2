import Link from 'next/link';
import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';
import { userState } from '../../store/account.store';
import { headerOptionState, sideBarState } from '../../store/common.store';
import styles from '../../styles/header.module.css';
import { getUserInfo } from '../../utils/userUtil';
import { DropdownMenu } from './dropdownMenu';
import { DropdownMenuOption } from '../../types/common/dropdown.type';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const { openModal } = useModal();
  const { ajax } = useAjax();
  const { showToast } = useOverlay();
  const setUser = useSetRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const [headerOption] = useRecoilState(headerOptionState);
  const setSideBar = useSetRecoilState(sideBarState);

  useEffect(() => {
    getUserInfo(ajax, setUser);
  }, []);

  useEffect(() => setSideBar(false), [pathname]);

  const logout = async () => {
    const [, error] = await ajax({
      method: HttpMethod.DELETE,
      url: 'auth/logout',
    });
    if (error) return;

    resetUser();
    showToast('로그아웃 되었습니다');
  }

  const optionMenuView = () => {
    if (headerOption.optionMenu?.dropdownMenu) {
      return dropdownMenuView(headerOption.optionMenu.dropdownMenu);
    }
    return <li onClick={() => openModal('setting')} className={`${styles.item} ${styles.setting}`}><img src="/icons/setting.svg" alt="setting" /></li>;
  }

  const dropdownMenuView = (dropdownMenu: DropdownMenuOption[]) => (
    <DropdownMenu
      title={<>
        <span className='line'></span>
        <span className='line'></span>
        <span className='line'></span>
      </>}
      titleClassName='menu-button'
      menus={dropdownMenu}
      className={`${styles.dropdown} ${styles.all_menu}`}
    />
  );

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <nav className={styles.top_menu_bar}>
          <ul className={styles.left}>
            <li className={styles.home}>
              <Link href='/' className={`${styles.item} ${styles.home}`}>BSM</Link>
            </li>
            <li
              className={`${styles.item} ${styles.all_menu} menu-button`}
              onClick={() => setSideBar(prev => !prev)}
            >
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
            </li>
            <div className={styles.title}>
              <h2>{headerOption.title}</h2>
            </div>
            {optionMenuView()}
          </ul>
          <div className={styles.title}>
            <h2>{headerOption.title}</h2>
          </div>
        </nav>
      </div>
    </header>
  );
}