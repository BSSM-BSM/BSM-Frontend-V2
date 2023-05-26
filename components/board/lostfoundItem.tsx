import Link from 'next/link'
import { useRecoilState } from 'recoil'
import { HttpMethod, useAjax } from '@/hooks/useAjax'
import { boardAndPostIdState, postOpenState, postState } from '@/store/board.store'
import styles from '@/styles/board/board.module.css'
import { Category, DetailPost, Post } from '@/types/board.type'
import DefaultProfilePic from '@/public/icons/profile_default.png'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'
import { UserInfoLink } from '@/components/board/userInfoLink'
import { elapsedTime, MilliSecondTime } from '@/utils/date'
import { getProfileSrc } from '@/utils/userUtil'

interface PostItemProps extends Post {
	boardId: string
	categoryList: {
		[index: string]: Category
	}
}

export const LostFoundItem = ({ boardId, categoryList, id, user, category, title, createdAt, view, totalComments, totalLikes }: PostItemProps) => {
	const [post, setPost] = useRecoilState(postState)
	const [, setBoardAndPostId] = useRecoilState(boardAndPostIdState)
	const [, setPostOpen] = useRecoilState(postOpenState)
	const { ajax } = useAjax()
	const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(getProfileSrc(user.code))

	const loadPost = async () => {
		const [data, error] = await ajax<DetailPost>({
			method: HttpMethod.GET,
			url: `post/${boardId}/${id}`,
			errorCallback() {
				setPost(null)
			},
		})
		if (error) return

		setBoardAndPostId({
			boardId,
			postId: id,
		})
		setPostOpen(true)
		setPost(data)
	}

	return (
		<li className={styles.post_item_wrap}>
			<div className={styles.post_item}>
				<div className={styles.total_comments}>
					<img src={'images'} />
				</div>
				<div className="flex-main cols gap-05">
					<Link href={`/board/${boardId}/${id}`} className={styles.post_title}>
						{title}
					</Link>
					<div className="rows space-between">
						<div className={styles.post_info}>
							<span className={styles.post_date}>{new Date(createdAt).toLocaleDateString()}</span>
						</div>
					</div>
				</div>
			</div>
			{post?.id === id && (
				<Link href={`/board/${boardId}/${id}`} className={`${styles.refresh} button-wrap`} onClick={loadPost}>
					<img src="/icons/refresh.svg" alt="refresh post" />
				</Link>
			)}
		</li>
	)
}
