import Modal from "@/components/common/modal";

export const LoginBox = () => (
  <Modal type="main" id="login" title='Login'>
    <a className="oauth-bsm" href="https://auth.bssm.app/oauth?clientId=0271cd66&redirectURI=https://bssm.app/oauth">
      <img src="/icons/bsm-icon.png" alt="bsm-icon" />
      <span>BSM 계정으로 계속</span>
    </a>
  </Modal>
);