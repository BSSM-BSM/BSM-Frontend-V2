import type { NextPage } from 'next'
import { useOverlay } from '../hooks/useOverlay';

const Home: NextPage = () => {
    const { showToast, showAlert } = useOverlay();
    return (
        <div>
            <button onClick={() => showToast('test\nmessage')}>토스트 메시지 테스트</button>
            <button onClick={() => showAlert('test\nmessage')}>알림 메시지 테스트</button>
        </div>
    )
}

export default Home
