import styled from "styled-components";
import { activePageCheck } from "../../utils/page";

export const Navbar = styled.nav`
  z-index: 1;
  display: none;
  width: 100vw;
  grid-area: navbar;
  @media screen and (max-width: 650px) {
    display: flex;
  }
`;

export const NavbarItemList = styled.ul`
  flex: auto;
  display: flex;
`;

export const NavbarItem = styled.li<{
  id?: string,
  subId?: string
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .5rem;
  padding: .5rem;
  cursor: pointer;
  color: var(--text-level-1);
  font-size: 1.05rem;
  font-weight: bold;
  text-align: center;
  transition: .25s;
  overflow: hidden;
  ${({id, subId}) => 
    (id && activePageCheck({id, subId}) )
    ?`
      z-index: 1;
      background-color: var(--level-1);
      box-shadow: var(--shadow);
      clip-path: inset(-.05rem -1rem -1rem -1rem);
      color: var(--accent);
      svg {
        color: var(--accent) !important;
      }
    `
    :``
  };
  svg {
    transition: .25s;
    color: var(--text-level-1);
  }
  &:hover {
    background-color: var(--level-1);
    box-shadow: var(--shadow);
    clip-path: inset(-.05rem -1rem -1rem -1rem);
    color: var(--accent);
    svg {
      color: var(--accent);
    }
  }
`;

export const NavbarIconWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.4rem;
  height: 2.4rem;
`;

export const NavbarItemContent = styled.div`
  overflow: hidden;
`;
