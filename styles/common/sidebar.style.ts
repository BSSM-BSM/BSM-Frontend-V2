import styled from "styled-components";
import { activePageCheck } from "../../utils/page";

export const Sidebar = styled.aside<{
  isOpen?: boolean
}>`
  z-index: 1;
  width: 25rem;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  grid-area: sidebar;
  transition: width .25s, transform .25s;
  @media screen and (max-width: 650px) {
    transform: translateX(0rem);
    ${({isOpen}) => (!isOpen) && `
      width: 0;
      transform: translateX(-25rem);
    `}
  }
`;

export const SidebarItemList = styled.ul`
  width: 25rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .5rem 0;
`;

export const SidebarItemWrap = styled.li<{
  order?: number
}>`
  ${({order}) => order && `
    transition: transform .25s calc(${order} * 100ms), max-height .25s calc(${order} * 100ms), opacity .1s calc(${order} * 100ms);
  `}
`;

export const SidebarItem = styled.div<{
  id?: string,
  subId?: string
}>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: .75rem 1.5rem;
  border-radius: .5rem;
  cursor: pointer;
  color: var(--text-level-1);
  font-weight: bold;
  transition: var(--hover-transition), margin-right .25s;
  overflow: hidden;
  ${({id, subId}) => 
    (id && activePageCheck({id, subId}) )
    ?`
      background-color: var(--level-1);
      margin-left: .5rem;
      border-radius: .5rem 0 0 .5rem;
      filter: var(--drop-shadow);
      clip-path: inset(-1rem 0 -1rem -1rem);
      color: var(--accent);
      svg {
        color: var(--accent) !important;
      }
    `
    :`
      margin: 0 .5rem;
    `
  };
  svg {
    transition: color .25s;
    color: var(--text-level-1);
  }
  &:hover {
    background-color: var(--level-1);
    filter: var(--drop-shadow);
    color: var(--accent);
    svg {
      color: var(--accent);
    }
  }
`;

export const SidebarNestedItemList = styled.ul<{
  isOpen: boolean
}>`
  margin-left: 1.5rem;
  padding-top: .5rem;
  & > ${SidebarItemWrap} {
    ${({isOpen}) => isOpen
    ? `
      transform: translateX(0);
      max-height: 4.5rem;
      opacity: 1;
    `
    : `
      transform: translateX(calc(-100% - .5rem));
      max-height: 0;
      opacity: 0;
    `}
  }
`

export const SidebarIconWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
`;

export const SidebarItemContent = styled.div`
  overflow: hidden;
`;

export const SidebarDropdownButtom = styled.div<{
  isOpen: boolean
}>`
  margin-left: auto;
  display: flex;
  align-items: center;
  font-size: 2.6rem;
  & > svg {
    ${({isOpen}) => isOpen
    ? 'transform: rotate(180deg);'
    : 'transform: rotate(0deg);'}
  }
  
`

export const SidebarUserProfile = styled.div`
  border-radius: 50%;
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  overflow: hidden;
`;

export const SidebarUserInfo = styled.div`
  font-size: 1.1rem;
`;

export const SidebarUserName = styled.div`
  font-size: 1.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
