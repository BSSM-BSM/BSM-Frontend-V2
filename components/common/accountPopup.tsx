import Modal from "./modal";

export const LoginBox = () => {
    const title = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br/>
            <span>로그인</span>
        </>
    );

    return (
        <Modal type="main" id="login" title={title}>
            <a className="button main oauth-bsm" href="https://auth.bssm.kro.kr/oauth?clientId=86174455&redirectURI=https://test.bssm.kro.kr/oauth">
                <img src="/icons/bsm-icon.png" alt="bsm-icon"/>
                <span>BSM 계정으로 계속</span>
            </a>
        </Modal>
    );
}