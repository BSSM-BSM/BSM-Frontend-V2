import { IoExtensionPuzzleOutline, IoGameControllerOutline } from 'react-icons/io5';
import SidebarItem from '@/components/common/sidebar/sidebarItem';
import { AiOutlineCloudServer, AiOutlineCloudUpload, AiOutlineOrderedList } from 'react-icons/ai';
import { FiHardDrive } from 'react-icons/fi';
import { FaSchool } from 'react-icons/fa';
import { GiBamboo } from 'react-icons/gi';
import { RiSurveyLine } from 'react-icons/ri';
import { RxDiscordLogo } from 'react-icons/rx';
import { MdLockPerson, MdOutlineHomeRepairService } from 'react-icons/md';
import { BsWikipedia } from 'react-icons/bs';

const SidebarServiceMenu = () => {
  const bsmServiceDropdownMenu = <>
    <SidebarItem
      Icon={MdLockPerson}
      iconSize={26}
      onClick={() => window.open('https://auth.bssm.kro.kr', '_blank')}
      order={1}
    >
      BSM Auth
    </SidebarItem>
    <SidebarItem
      Icon={AiOutlineCloudUpload}
      iconSize={26}
      onClick={() => window.open('https://deploy.bssm.kro.kr', '_blank')}
      order={2}
    >
      BSM Deploy
    </SidebarItem>
    <SidebarItem
      Icon={FiHardDrive}
      iconSize={26}
      onClick={() => window.open('https://drive.bssm.kro.kr', '_blank')}
      order={3}
    >
      BSM Cloud
    </SidebarItem>
    <SidebarItem
      Icon={IoGameControllerOutline}
      iconSize={26}
      onClick={() => window.open('https://tetris.bssm.kro.kr', '_blank')}
      order={4}
    >
      BSM Tetris
    </SidebarItem>
  </>;

  const otherServiceDropdownMenu = <>
    <SidebarItem
      Icon={AiOutlineOrderedList}
      iconSize={26}
      onClick={() => window.open('https://bgit.bssm.kro.kr', '_blank')}
      order={1}
    >
      BGIT
    </SidebarItem>
    <SidebarItem
      Icon={BsWikipedia}
      iconSize={26}
      onClick={() => window.open('https://bumawiki.kro.kr', '_blank')}
      order={2}
    >
      부마위키
    </SidebarItem>
    <SidebarItem
      Icon={MdOutlineHomeRepairService}
      iconSize={26}
      onClick={() => window.open('https://portfolio.bssm.io', '_blank')}
      order={3}
    >
      BSSM Portfolio
    </SidebarItem>
    <SidebarItem
      Icon={RiSurveyLine}
      iconSize={26}
      onClick={() => window.open('https://www.simblue.kro.kr', '_blank')}
      order={4}
    >
      심청이
    </SidebarItem>
    <SidebarItem
      Icon={GiBamboo}
      iconSize={26}
      onClick={() => window.open('https://bsmboo.kro.kr', '_blank')}
      order={5}
    >
      BSMBOO
    </SidebarItem>
    <SidebarItem
      Icon={RxDiscordLogo}
      iconSize={26}
      onClick={() => window.open('https://nightcord.bssm.kro.kr', '_blank')}
      order={6}
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
      iconSize={26}
      dropdownMenu={serviceDropdownMenu}
      dropdownInitialOpen={true}
    >
      모든 서비스
    </SidebarItem>
  );
}

export default SidebarServiceMenu;
