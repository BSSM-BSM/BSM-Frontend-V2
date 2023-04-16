import { IoExtensionPuzzleOutline, IoGameControllerOutline } from 'react-icons/io5';
import SidebarItem from '@/components/common/sidebar/sidebarItem';
import { useRouter } from 'next/navigation';
import { AiOutlineOrderedList, AiOutlineUser } from 'react-icons/ai';
import { FiHardDrive } from 'react-icons/fi';
import { FaSchool } from 'react-icons/fa';
import { GiBamboo } from 'react-icons/gi';
import { RxDiscordLogo } from 'react-icons/rx';

const SidebarServiceMenu = () => {
  const router = useRouter();

  const bsmServiceDropdownMenu = <>
    <SidebarItem
      Icon={AiOutlineUser}
      iconSize={26}
      onClick={() => window.open('https://auth.bssm.kro.kr', '_blank')}
      order={1}
    >
      BSM Auth
    </SidebarItem>
    <SidebarItem
      Icon={AiOutlineOrderedList}
      iconSize={26}
      onClick={() => window.open('https://bgit.bssm.kro.kr', '_blank')}
      order={2}
    >
      BGIT
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
      Icon={FaSchool}
      iconSize={26}
      onClick={() => window.open('https://school.busanedu.net/bssm-h/main.do', '_blank')}
      order={1}
    >
      학교 홈페이지
    </SidebarItem>
    <SidebarItem
      Icon={GiBamboo}
      iconSize={26}
      onClick={() => window.open('https://bsmboo.kro.kr', '_blank')}
      order={2}
    >
      BSMBOO
    </SidebarItem>
    <SidebarItem
      Icon={RxDiscordLogo}
      iconSize={26}
      onClick={() => window.open('https://nightcord.bssm.kro.kr', '_blank')}
      order={3}
    >
      NightCord
    </SidebarItem>
  </>;

  const serviceDropdownMenu = <>
    <SidebarItem
      order={1}
      dropdownMenu={bsmServiceDropdownMenu}
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
      onClick={() => router.push('/service')}
      dropdownMenu={serviceDropdownMenu}
      dropdownInitialOpen={true}
    >
      모든 서비스
    </SidebarItem>
  );
}

export default SidebarServiceMenu;
