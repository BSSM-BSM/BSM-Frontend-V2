import styled from "styled-components";

export const Sidebar = styled.aside`
  width: 25rem;
  grid-area: sidebar;
  @media screen and (max-width: 650px) {
    display: none;
  }
`;

export const SidebarItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .5rem;
`;

export const SidebarItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: .75rem 1.5rem;
  border-radius: .5rem;
  cursor: pointer;
  color: var(--text-level-1);
  font-weight: bold;
  transition: .25s;
  svg {
    transition: color .25s;
    color: var(--text);
  }
  overflow: hidden;
  &:hover {
    background-color: var(--hover);
    filter: var(--drop-shadow);
    color: var(--accent);
    svg {
      color: var(--accent);
    }
  }
`;

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
