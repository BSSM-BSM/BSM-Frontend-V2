import * as S from '../../../styles/common/sidebar.style';
import { IconBaseProps, IconType } from "react-icons/lib/esm/iconBase";
import { ReactNode } from 'react';

interface SidebarItemProps {
  Icon?: IconType,
  IconElement?: ReactNode,
  iconSize?: number,
  children?: ReactNode,
  onClick?: () => void;
}

const SidebarItem = ({
  Icon,
  IconElement,
  iconSize,
  children,
  onClick
}: SidebarItemProps) => (
  <S.SidebarItem onClick={onClick}>
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
  </S.SidebarItem>
);

export default SidebarItem;
