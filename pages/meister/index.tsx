import styles from '../../styles/meister/index.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/common/modal';
import Link from 'next/link';

interface MeisterInfo {
    scoreHtmlContent: string;
    pointHtmlContent: string;
    score: number;
    positivePoint: number;
    negativePoint: number;
}

const MeisterPage: NextPage = () => {
    const { ajax } = useAjax();
    const { openModal } = useModal();
    const [noPw, setNoPw] = useState(true);
    const [user] = useRecoilState(userState);
    const [grade, setGrade] = useState(user.grade);
    const [classNo, setClassNo] = useState(user.classNo);
    const [studentNo, setStudentNo] = useState(user.studentNo);
    const [pw, setPw] = useState('');
    const [meisterInfo, setMeisterInfo] = useState<MeisterInfo>({
        scoreHtmlContent: '',
        pointHtmlContent: '',
        score: 0,
        positivePoint: 0,
        negativePoint: 0,
    });

    const loadMeisterInfo = () => {
        ajax<MeisterInfo>({
            url: 'meister/detail',
            method: 'post',
            payload: {
                grade,
                classNo,
                studentNo,
                pw: noPw? '': pw
            },
            callback(data) {
                setMeisterInfo(data);
                setPw('');
            },
            errorCallback() {
                setMeisterInfo({
                    scoreHtmlContent: '',
                    pointHtmlContent: '',
                    score: 0,
                    positivePoint: 0,
                    negativePoint: 0,
                });
            }
        });
    }

    const meisterPointPostProcessing = () => {
        setTimeout(() => {
            document.querySelectorAll('.fas.fa-sad-cry').forEach((item) => {
                item?.parentElement?.parentElement?.parentElement?.parentElement?.classList.add(styles.bad);
            });
        }, 10);
    }

    return (
        <div className='container _100'>
            <Head>
                <title>마이스터 역량인증제 - BSM</title>
            </Head>
            <div className='title center'>
                <h1>마이스터 점수 및 상벌점 조회</h1>
            </div>
            <br /><br /><br />
            <form autoComplete='off' onSubmit={e => {
                e.preventDefault();
                loadMeisterInfo();
            }}>
                <div>
                    <input
                        value={grade || ''}
                        type='number'
                        className='input-text'
                        placeholder='학년'
                        min='1'
                        max='3'
                        required
                        onChange={e => setGrade(Number(e.target.value))}
                    />
                    <input
                        value={classNo || ''}
                        type='number'
                        className='input-text'
                        placeholder='반'
                        min='1'
                        max='4'
                        required
                        onChange={e => setClassNo(Number(e.target.value))}
                    />
                    <input
                        value={studentNo || ''}
                        type='number'
                        className='input-text'
                        placeholder='번호'
                        min='1'
                        max='16'
                        required
                        onChange={e => setStudentNo(Number(e.target.value))}
                    />
                </div>
                <div>
                    <input
                        disabled={noPw}
                        className={`input-text ${noPw? 'inactive': ''}`}
                        type='password'
                        placeholder='마이스터 인증제 사이트 비밀번호'
                        required
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                    />
                    <br />
                    <label>
                        <input type='checkbox' checked={noPw} onChange={e => setNoPw(e.target.checked)} />
                        <span>비밀번호 사용 안함</span>
                    </label>
                </div>
                <br />
                {!noPw && <h4>마이스터 인증제 사이트 비밀번호가 필요합니다.</h4>}
                <br />
                <div className='rows gap-1 center'>
                    <Link href='/meister/ranking'><a className='button'>랭킹</a></Link>
                    <button type='submit' className='button accent'>조회</button>
                </div>
            </form>
            {
                meisterInfo.scoreHtmlContent && 
                <div className={styles.result}>
                    <h3 className='right'>
                        <span>
                            {`상점: ${meisterInfo.positivePoint} 벌점: ${meisterInfo.negativePoint}`}
                        </span>
                        <span className='detail' onClick={() => openModal('meister_point')}> 자세히 보기</span>
                    </h3>
                    <div className={styles.score} dangerouslySetInnerHTML={{__html: meisterInfo.scoreHtmlContent}}></div>
                </div>
            }

            <Modal type='big' id='meister_point' title='상벌점' callback={meisterPointPostProcessing}>
                <div className={styles.point} dangerouslySetInnerHTML={{__html: meisterInfo.pointHtmlContent}}></div>
            </Modal>
        </div>
    );
}

export default MeisterPage;