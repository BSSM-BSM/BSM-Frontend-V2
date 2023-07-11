import { widgetLockState } from "@/store/widget.store";
import Link from "next/link";
import { getRecoil } from "recoil-nexus";
import styled, { css } from "styled-components";

export const WidgetWrap = styled.div`
  width: 100%;
  min-height: 100%;
  padding: .5rem;
`;

export const WidgetCss = css`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: .75rem;
  transition: var(--hover-transition);
  cursor: pointer;
  font-size: 1.8rem;
  font-weight: bold;
  background-color: var(--level-3-opacity);

  ${() => {
    const isWidgetLock = getRecoil(widgetLockState);
    return isWidgetLock ?`` : 'pointer-events: none;';
  }}

  &:hover {
    background-color: var(--hover);
  }

  h4 {
    font-size: 1.8rem;
  }

  h5 {
    font-size: 1.4rem;
    font-weight: normal;
  }
`;

export const Widget = styled.div`
  ${WidgetCss}
`;

export const LoginUserWidget = styled(Link)`
  ${WidgetCss}

`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  img {
    border-radius: 50%;
    width: 3.5rem;
    height: 3.5rem;
  }
`

export const NoLoginUserWidget = styled(Widget)`

`;

export const MeisterWidget = styled(Link)`
  ${WidgetCss}

  h4 {
    font-size: 1.6rem;
  }

  h4 span:nth-child(2) {
    margin-left: .5rem;
    font-size: 1.3rem;
    color: var(--text-level-1);
  }

  h5 {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.4rem;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
  }
`;
