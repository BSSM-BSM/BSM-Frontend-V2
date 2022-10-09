import Modal from "./modal";

export const LoginBox = () => (
    <Modal type="main" id="login" title='Login'>
        <a className="button main oauth-bsm" href="https://auth.bssm.kro.kr/oauth?clientId=50dacb2a&redirectURI=https://test.bssm.kro.kr/oauth">
            <img src="/icons/bsm-icon.png" alt="bsm-icon"/>
            <span>BSM 계정으로 계속</span>
        </a>
    </Modal>
);