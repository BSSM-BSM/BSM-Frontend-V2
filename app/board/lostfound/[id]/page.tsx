'use client'

import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import styles from '@/styles/board/post/post.module.css'
import { HttpMethod, useAjax } from '@/hooks/useAjax'
import { headerOptionState, pageState } from '@/store/common.store'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import Head from 'next/head'
import { UserInfoLink } from '@/components/board/userInfoLink'
import { postXssFilter } from '@/components/board/post/postView'
import { userState } from '@/store/account.store'

const LostFoundDetail = () => {
	const { ajax } = useAjax()
	const { id } = useParams()
	const user = useRecoilValue(userState)
	const [detail, setDetail] = React.useState({
		id: -1,
		objectName: 'objectName',
		imgSrc: 'https://www.busan.com/nas/data/content/image/2012/04/28/20120428000068_0.jpg',
		location: 'x',
		findDateTime: '2018-12-15T10:00:00',
		description: 'x',
		process: 'IN_PROGRESS',
		foundUser: {
			code: -1,
			nickname: 'anonymous',
		},
	})
	const setHeaderOption = useSetRecoilState(headerOptionState)
	const setPage = useSetRecoilState(pageState)

	React.useEffect(() => {
		;(async () => {
			const [data, error] = await ajax<any>({
				method: HttpMethod.GET,
				url: `https://bssm.kro.kr/api/lost-found/find/${id}`,
				errorCallback() {},
			})
			setDetail(data)
			setPage({ id: 'board', subId: 'lost-found' })
			setHeaderOption({ title: data.objectName })
		})()
	}, [])

	const onClickProcessDone = async () => {
		const [data, error] = await ajax<any>({
			method: HttpMethod.PUT,
			url: `https://bssm.kro.kr/api/lost-found/def/update/${id}`,
			errorCallback() {},
			config: {
				data: {
					process: 'FINISHED',
				},
			},
		})
		setDetail(data)
	}

	return (
		<div className="container _110">
			<Head>
				<title>{detail?.objectName} - 커뮤니티 - BSM</title>
			</Head>
			<div style={{ marginTop: '4vw' }} className={styles.post_wrap}>
				<div className={styles.post_info}>
					<div className="cols space-between flex-main">
						<h2 className={styles.title}>{detail?.objectName}</h2>
						<div className="rows space-between">
							<span className="bold">
								<UserInfoLink userCode={detail.foundUser.code} nickname={detail.foundUser.nickname} />
							</span>
						</div>
						<br />
						<div className="rows space-between">
							<span>보관 장소 : {detail.location}</span>
						</div>
						<div className="rows space-between">
							<span>습득 날짜 : {detail.findDateTime}</span>
						</div>
						<div className="rows space-between">
							<span>물품 상태 : {detail.process === 'FINISHED' ? '수령 완료' : '수령 대기중'}</span>
						</div>
						{user.isLogin && user.code === detail.foundUser.code && (
							<button style={{ padding: '10px' }} onClick={onClickProcessDone}>
								수령 완료 처리하기
							</button>
						)}
					</div>
				</div>
				<div className={styles.post_content} dangerouslySetInnerHTML={{ __html: postXssFilter.process(detail.description) }} />
				<img src={detail.imgSrc} />
			</div>
			<div className={styles.like_wrap}></div>
		</div>
	)
}

export default LostFoundDetail
