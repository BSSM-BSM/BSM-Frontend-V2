import * as S from '@/styles/common/navbar.style';
import { IconType } from "react-icons/lib/esm/iconBase";
import { ReactNode } from 'react';

interface NavbarItemProps {
  id?: string,
  subId?: string,
  Icon?: IconType,
  IconElement?: ReactNode,
  iconSize?: number,
  children?: ReactNode,
  onClick?: () => void;
}

const NavbarItem = ({
  id,
  subId,
  Icon,
  IconElement,
  iconSize,
  children,
  onClick
}: NavbarItemProps) => (
  <S.NavbarItem id={id} subId={subId} onClick={onClick}>
    {
      (Icon || IconElement) && 
      <S.NavbarIconWrap>
        {Icon && <Icon size={iconSize} />}
        {IconElement}
      </S.NavbarIconWrap>
    }
    <S.NavbarItemContent>
      {children}
    </S.NavbarItemContent>
  </S.NavbarItem>
);

export default NavbarItem;
