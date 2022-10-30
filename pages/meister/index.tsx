import styles from '../../styles/meister/index.module.css';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/common/modal';
import Link from 'next/link';
import { TextInput } from '../../components/common/inputs/textInput';
import { NumberInput } from '../../components/common/inputs/numberInput';
import { headerOptionState } from '../../store/common.store';
import { UserRole } from '../../types/userType';
import { Button } from '../../components/common/buttons/button';

interface MeisterInfo {
    scoreHtmlContent: string;
    pointHtmlContent: string;
    score: number;
    positivePoint: number;
    negativePoint: number;
}

const MeisterPage: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const { ajax } = useAjax();
    const { openModal } = useModal();
    const [noPw, setNoPw] = useState(true);
    const [user] = useRecoilState(userState);
    const [grade, setGrade] = useState<number>(0);
    const [classNo, setClassNo] = useState<number>(0);
    const [studentNo, setStudentNo] = useState<number>(0);
    const [pw, setPw] = useState('');
    const [meisterInfo, setMeisterInfo] = useState<MeisterInfo>({
        scoreHtmlContent: '',
        pointHtmlContent: '',
        score: 0,
        positivePoint: 0,
        negativePoint: 0,
    });

    useEffect(() => {
        if (!user.isLogin || user.role !== UserRole.STUDENT) return;
        setGrade(user.student.grade);
        setClassNo(user.student.classNo);
        setStudentNo(user.student.studentNo);
    }, [user]);

    useEffect(() => {
        setHeaderOption({title: '마이스터 점수 및 상벌점 조회'});
    }, []);

    const loadMeisterInfo = async () => {
        const [data, error] = await ajax<MeisterInfo>({
            url: 'meister/detail',
            method: HttpMethod.POST,
            payload: {
                grade,
                classNo,
                studentNo,
                pw: noPw? '': pw
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
        if (error) return;

        setMeisterInfo(data);
        setPw('');
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
            <form className={`${styles.form} cols gap-1`} autoComplete='off' onSubmit={e => {
                e.preventDefault();
                loadMeisterInfo();
            }}>
                <div className='rows gap-05 center'>
                    <NumberInput
                        setCallback={setGrade}
                        initial={undefined}
                        value={grade}
                        min={1}
                        max={3}
                        required
                        placeholder='학년'
                    />
                    <NumberInput
                        setCallback={setClassNo}
                        initial={undefined}
                        value={classNo}
                        min={1}
                        max={4}
                        required
                        placeholder='반'
                    />
                    <NumberInput
                        setCallback={setStudentNo}
                        initial={undefined}
                        value={studentNo}
                        min={1}
                        max={16}
                        required
                        placeholder='번호'
                    />
                </div>
                <div className='cols gap-1 center'>
                    <TextInput
                        disabled={noPw}
                        type='password'
                        setCallback={setPw}
                        placeholder='마이스터 인증제 사이트 비밀번호'
                        required
                    />
                    <label className='checkbox center'>
                        <input type='checkbox' checked={noPw} onChange={e => setNoPw(e.target.checked)} />
                        <span>비밀번호 사용 안함</span>
                    </label>
                </div>
                {!noPw && <h4>조회하기 위해 마이스터 인증제 사이트 비밀번호가 필요합니다.</h4>}
                <br />
                <div className='rows gap-1 center'>
                    <Link href='/meister/ranking'><a><Button>랭킹</Button></a></Link>
                    <Button type='submit' className='accent'>조회</Button>
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