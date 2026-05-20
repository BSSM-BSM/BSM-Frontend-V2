import { useState } from 'react';
import Modal from '@/components/common/modal';
import { leftTime } from '@/utils/util';

interface Props {
  serverTime: Date;
  clientTime: Date;
}

export const InvalidClientTimeBox = () => {
  const [serverTime, setServerTime] = useState<Date>(new Date());
  const [clientTime, setClientTime] = useState<Date>(new Date());

  const onOpenHandler = ({ serverTime, clientTime }: Props) => {
    setServerTime(serverTime);
    setClientTime(clientTime);
  }

  const formatedTime = leftTime(Math.abs(serverTime.getTime() - clientTime.getTime()));
  const timeMessage = `디바이스의 시간이 서버보다 ${formatedTime} ${serverTime > clientTime ? '느립니다' : '빠릅니다'}`;

  return (
    <Modal<Props>
      type='main'
      id='invalidClientTime'
      title={'API 요청이 만료되었습니다'}
      onOpen={onOpenHandler}
    >
      <p>시간이 올바르지않아 API 요청이 만료되었습니다</p>
      <p>디바이스를 현재시간으로 동기화하세요</p>
      <br />
      <p>{timeMessage}</p>
      <br />
      <p>Server: {serverTime.toLocaleString()}</p>
      <p>Client: {clientTime.toLocaleString()}</p>
    </Modal>
  );
}
