import * as S from '../../../styles/common/sidebar.style';
import { IconType } from "react-icons/lib/esm/iconBase";
import { ReactNode, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface SidebarItemProps {
  id?: string,
  subId?: string,
  order?: number,
  Icon?: IconType,
  IconElement?: ReactNode,
  iconSize?: number,
  children?: ReactNode,
  onClick?: () => void;
  dropdownMenu?: ReactNode,
  dropdownInitialOpen?: boolean
}

const SidebarItem = ({
  id,
  subId,
  order,
  Icon,
  IconElement,
  iconSize,
  children,
  onClick,
  dropdownMenu,
  dropdownInitialOpen
}: SidebarItemProps) => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(dropdownInitialOpen ?? false);

  return (
    <S.SidebarItemWrap order={order}>
      <S.SidebarItem
        id={dropdownIsOpen? undefined: id}
        subId={subId}
        onClick={() => {
          dropdownMenu && setDropdownIsOpen(prev => !prev);
          onClick && onClick();
        }}
      >
        {
          (Icon || IconElement) && 
          <S.SidebarIconWrap>
            {Icon && <Icon size={iconSize} />}
            {IconElement}
          </S.SidebarIconWrap>
        }
        <S.SidebarItemContent>
          {children}
        </S.SidebarItemContent>
        {
          dropdownMenu &&
          <S.SidebarDropdownButtom isOpen={dropdownIsOpen}>
            <FiChevronDown />
          </S.SidebarDropdownButtom>
        }
      </S.SidebarItem>
      {
        dropdownMenu &&
        <S.SidebarNestedItemList isOpen={dropdownIsOpen}>
          {dropdownMenu}
        </S.SidebarNestedItemList>
      }
    </S.SidebarItemWrap>
  );
};

export default SidebarItem;
