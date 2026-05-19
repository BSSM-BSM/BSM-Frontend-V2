import * as S from '@/styles/common/navbar.style';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface NavbarItemProps {
  id?: string,
  subId?: string,
  Icon?: IconType,
  IconElement?: ReactNode,
  iconSize?: number | string,
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
