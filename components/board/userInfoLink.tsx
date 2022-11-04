interface UserInfoLinkProps {
    nickname: string,
    userCode: number
}

export const UserInfoLink = ({
    nickname,
    userCode
}: UserInfoLinkProps) => (
    userCode > 0
    ? <a target='_blank' rel='noopener noreferrer' href={`https://auth.bssm.kro.kr/user/${userCode}`}>{nickname}</a>
    : <span className="gray">{nickname}</span>
);