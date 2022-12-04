import styles from '../../styles/common/dropdown-menu.module.css';
import { ReactNode } from "react"
import { DropdownMenuOption } from "../../store/common.store"

interface DropdownMenuProps {
    title?: string | ReactNode,
    menus: DropdownMenuOption[],
    mark?: boolean,
    meatballsMenu?: boolean,
    className?: string
}

export const DropdownMenu = ({
    title,
    menus,
    mark,
    meatballsMenu,
    className
}: DropdownMenuProps) => (
    <div className={`${styles.dropdown_menu} ${meatballsMenu? styles.meatballs_menu: ''} ${className}`}>
        {
            meatballsMenu
            ? <div className={styles.title}>···</div>
            : <div className={`${styles.title} ${mark? styles.mark: ''}`}>{title}</div>
        }
        <ul className={styles.dropdown_content}>
            {menus.map(menu => (
                <li key={menu.text} onClick={menu.callback} className={styles.option}>
                    {menu.text}
                </li>
            ))}
        </ul>
    </div>
)