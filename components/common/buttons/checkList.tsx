import styles from '../../../styles/common/check-list.module.css';

interface CheckListProps<ID, T extends Menu<ID>> {
    currentMenu: ID,
    menuList: T[],
    callback: (menu: T) => void,
    className?: string
}

interface Menu<ID> {
    name: string,
    id: ID
}

export const CheckList = <ID, T extends Menu<ID>>({
    currentMenu,
    menuList,
    callback,
    className
}: CheckListProps<ID, T>) => (
    <ul className={`${styles.check_list} button-wrap scroll-bar no-overlay horizontal ${className ?? ''}`}>{
        menuList.map(menu => (
            <li
                key={`${menu.id}-${menu.name}`}
                onClick={() => callback(menu)}
                className={menu.id === currentMenu? styles.active: ''}
            >
                {menu.name}
            </li>
        ))
    }</ul>
);