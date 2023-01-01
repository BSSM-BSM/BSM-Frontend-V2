import styles from '../../styles/common/dropdown-menu.module.css';
import { ReactNode } from "react"
import { DropdownMenuOption } from "../../store/common.store"
import { Button } from './buttons/button';

interface DropdownMenuProps {
  title?: string | ReactNode,
  menus: DropdownMenuOption[],
  mark?: boolean,
  meatballsMenu?: boolean,
  button?: boolean,
  className?: string,
  titleClassName?: string
}

export const DropdownMenu = ({
  title,
  menus,
  mark,
  meatballsMenu,
  button,
  className,
  titleClassName
}: DropdownMenuProps) => (
  <div className={`${styles.dropdown_menu} ${meatballsMenu? styles.meatballs_menu: ''} ${className}`}>
    {
      button
      ? <Button className={`${styles.title} ${titleClassName} ${mark? styles.mark: ''}`}>{meatballsMenu? '···': title}</Button>
      : <div className={`${styles.title} ${titleClassName} ${mark? styles.mark: ''}`}>{meatballsMenu? '···': title}</div>
    }
    <ul className={styles.dropdown_content}>
      {menus.map(menu => (
        <li key={menu.text} onClick={menu.callback} className={styles.option}>
          {menu.text}
        </li>
      ))}
    </ul>
  </div>
);