interface UserInfoLinkProps {
  nickname: string,
  userId: number
}

export const UserInfoLink = ({
  nickname,
  userId
}: UserInfoLinkProps) => (
  userId > 0
  ? <a target='_blank' rel='noopener noreferrer' href={`https://auth.bssm.app/user/${userId}`}>{nickname}</a>
  : <span className="gray">{nickname}</span>
);