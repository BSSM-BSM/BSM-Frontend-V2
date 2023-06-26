'use client';

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { headerOptionState, pageState } from '@/store/common.store';
import { Banner, BannerPos } from '@/components/common/banner';
import { BannerType } from '@/types/banner.type';
import { GiBamboo } from 'react-icons/gi';
import { FiHardDrive } from 'react-icons/fi';
import { FaSchool } from 'react-icons/fa';
import { RxDiscordLogo } from 'react-icons/rx';
import { AiOutlineOrderedList, AiOutlineUser } from 'react-icons/ai';
import { IoGameControllerOutline } from 'react-icons/io5';

const ServiceListPage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);

  useEffect(() => {
    setHeaderOption({ title: '모든 서비스', headTitle: '모든 서비스 - BSM' });
    setPage({ id: 'service' });
  }, []);

  return (
    <div className="container _50">
      <>
        <Banner position={BannerPos.BOTTOM} type={BannerType.HORIZONTAL} />
      </>
      <ul className="list-wrap left">
        <li>
          <h3>BSM 서비스</h3>
          <ul className="list bold">
            <li className="pointer" onClick={() => window.open('https://auth.bssm.kro.kr', '_blank')}>
              <AiOutlineUser size="2.2rem" />
              <span>BSM Auth</span>
              <span>부산소마고 통합 계정 관리 서비스</span>
            </li>
            <li className="pointer" onClick={() => window.open('https://bgit.bssm.kro.kr', '_blank')}>
              <AiOutlineOrderedList size="2.2rem" />
              <span>BGIT</span>
              <span>부산소마고 깃허브, 백준 랭킹 서비스</span>
            </li>
            <li className="pointer" onClick={() => window.open('https://drive.bssm.kro.kr', '_blank')}>
              <FiHardDrive size="2.2rem" />
              <span>BSM Cloud</span>
              <span>파일 공유 서비스</span>
            </li>
            <li className="pointer" onClick={() => window.open('https://tetris.bssm.kro.kr', '_blank')}>
              <IoGameControllerOutline size="2.2rem" />
              <span>BSM Tetris</span>
              <span>온라인 테트리스</span>
            </li>
          </ul>
        </li>
        <li>
          <h3>외부 서비스</h3>
          <ul className="list bold">
            <li
              className="pointer"
              onClick={() => window.open('https://school.busanedu.net/bssm-h/main.do', '_blank', 'noopener noreferrer')}
            >
              <FaSchool size="2.2rem" />
              <span>학교 홈페이지</span>
            </li>
            <li className="pointer" onClick={() => window.open('https://bsmboo.kro.kr', '_blank')}>
              <GiBamboo size="2.2rem" />
              <span>BSMBOO</span>
              <span>부산소마고 대나무숲</span>
            </li>
            <li className="pointer" onClick={() => window.open('https://nightcord.bssm.kro.kr', '_blank')}>
              <RxDiscordLogo size="2.2rem" />
              <span>NightCord</span>
              <span>익명 채팅 서비스</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default ServiceListPage;
