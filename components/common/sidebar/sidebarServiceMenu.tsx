import { IoExtensionPuzzleOutline, IoGameControllerOutline } from 'react-icons/io5';
import SidebarItem from '@/components/common/sidebar/sidebarItem';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { FiHardDrive } from 'react-icons/fi';
import { GiBamboo } from 'react-icons/gi';
import { RiSurveyLine } from 'react-icons/ri';
import { RxDiscordLogo } from 'react-icons/rx';
import { MdLockPerson, MdOutlineHomeRepairService } from 'react-icons/md';
import { BsWikipedia } from 'react-icons/bs';
import React from 'react';

const SidebarServiceMenu = () => {
  const bsmServiceDropdownMenu = <>
    <SidebarItem
      Icon={MdLockPerson}
      iconSize="2.6rem"
      onClick={() => window.open('https://auth.bssm.app', '_blank')}
      order={1}
    >
      BSM Auth
    </SidebarItem>
    <SidebarItem
      Icon={AiOutlineOrderedList}
      iconSize="2.6rem"
      onClick={() => window.open('https://bgit.bssm.app', '_blank')}
      order={2}
    >
      BGIT
    </SidebarItem>
    <SidebarItem
      Icon={FiHardDrive}
      iconSize="2.6rem"
      onClick={() => window.open('https://drive.bssm.app', '_blank')}
      order={3}
    >
      BSM Cloud
    </SidebarItem>
    <SidebarItem
      Icon={IoGameControllerOutline}
      iconSize="2.6rem"
      onClick={() => window.open('https://tetris.bssm.app', '_blank')}
      order={4}
    >
      BSM Tetris
    </SidebarItem>
  </>;

  const otherServiceDropdownMenu = <>
    <SidebarItem
      Icon={BsWikipedia}
      iconSize="2.6rem"
      onClick={() => window.open('https://buma.wiki', '_blank')}
      order={1}
    >
      부마위키
    </SidebarItem>
    <SidebarItem
      Icon={MdOutlineHomeRepairService}
      iconSize="2.6rem"
      onClick={() => window.open('https://portfolio.bssm.io', '_blank')}
      order={2}
    >
      BSSM Portfolio
    </SidebarItem>
    <SidebarItem
      Icon={RiSurveyLine}
      iconSize="2.6rem"
      onClick={() => window.open('https://www.simblue.kro.kr', '_blank')}
      order={3}
    >
      심청이
    </SidebarItem>
    <SidebarItem
      Icon={GiBamboo}
      iconSize="2.6rem"
      onClick={() => window.open('https://bsmboo.kro.kr', '_blank')}
      order={4}
    >
      BSMBOO
    </SidebarItem>
    <SidebarItem
      Icon={RxDiscordLogo}
      iconSize="2.6rem"
      onClick={() => window.open('https://nightcord.bssm.app', '_blank')}
      order={5}
    >
      NightCord
    </SidebarItem>
  </>;

  const serviceDropdownMenu = <>
    <SidebarItem
      order={1}
      dropdownMenu={bsmServiceDropdownMenu}
      dropdownInitialOpen={true}
    >
      BSM 서비스
    </SidebarItem>
    <SidebarItem
      order={2}
      dropdownMenu={otherServiceDropdownMenu}
    >
      외부 서비스
    </SidebarItem>
  </>;

  return (
    <SidebarItem
      id='service'
      Icon={IoExtensionPuzzleOutline}
      iconSize="2.6rem"
      dropdownMenu={serviceDropdownMenu}
      dropdownInitialOpen={true}
    >
      모든 서비스
    </SidebarItem>
  );
}

export default SidebarServiceMenu;
