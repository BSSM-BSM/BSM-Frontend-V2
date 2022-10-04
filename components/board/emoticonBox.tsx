import styles from '../../styles/board/emoticon.module.css';
import { useEffect, useState } from "react"
import { HttpMethod, useAjax } from "../../hooks/useAjax"
import { Emoticon } from "../../types/boardType"
import Modal from "../common/modal"
import Image from 'next/image';

export const EmoticonBoxWrap = () => (
    <>
        <EmoticonBox />
        <EmoticonManageBox />
    </>
);

export const EmoticonBox = () => {
    const {ajax} = useAjax();
    const [emoticonList, setEmoticonList] = useState<Emoticon[]>([]);
    const [selectId, setSelectId] = useState<number>(0);

    const loadEmoticons = () => {
        ajax<Emoticon[]>({
            url: 'emoticon',
            method: HttpMethod.GET,
            callback(data) {
                setEmoticonList(data);
            }
        });
    }

    return (
        <Modal id='emoticon' title='이모티콘 넣기' callback={loadEmoticons}>
            <ul className={`${styles.emoticon_list} scroll-bar horizontal`}>{
                emoticonList.map(emoticon => (
                    <li key={emoticon.id} onClick={() => setSelectId(emoticon.id)}>
                        <Image
                            src={`https://test.bssm.kro.kr/resource/board/emoticon/${emoticon.id}/0.png`}
                            width='100px'
                            height='50px'
                            alt={emoticon.name}
                        />
                    </li>
                ))
            }</ul>
            <ul className={`${styles.emoticon_item_list} scroll-bar`}>{
                emoticonList
                .filter(emoticon => emoticon.id === selectId)
                ?.[0]?.items.map(item => (
                    <li key={`${item.id}/${item.idx}`}>
                        <img
                            src={`https://test.bssm.kro.kr/resource/board/emoticon/${item.id}/${item.idx}.${item.type}`}
                            alt={String(item.idx)}
                        />
                    </li>
                ))
            }</ul>
        </Modal>
    );
}

export const EmoticonManageBox = () => {
    const {ajax} = useAjax();
    const [emoticonList, setEmoticonList] = useState<Emoticon[]>([]);
    const [selectId, setSelectId] = useState<number>(0);
    const [selectMenuIdx, setSelectMenuIdx] = useState<number>(-1);

    const menuList = [
        {
            element: (<></>),
            name: '활성화된 이모티콘'
        },
        {
            element: (<></>),
            name: '승인 대기'
        }
    ]

    const loadEmoticons = () => {
        const url = (() => {
            switch (selectMenuIdx) {
                case 0: return 'emoticon';
                case 1: return 'admin/emoticon/inactive';
                default: return '';
            }
        })();
        ajax<Emoticon[]>({
            url,
            method: HttpMethod.GET,
            callback(data) {
                setEmoticonList(data);
            }
        });
    }

    useEffect(() => {
        if (selectMenuIdx === -1) return;
        loadEmoticons();
    }, [selectMenuIdx]);

    const activeEmoticon = () => {
        if (!confirm('정말 이모티콘을 활성화하시겠습니까?')) return;
        ajax({
            url: `admin/emoticon/${selectId}`,
            method: HttpMethod.PUT,
            callback(data) {
                loadEmoticons();
                setSelectId(0);
            }
        });
    }

    const deleteEmoticon = () => {
        if (!confirm('정말 이모티콘을 삭제하시겠습니까?')) return;
        ajax({
            url: `admin/emoticon/${selectId}/delete`,
            method: HttpMethod.PUT,
            payload: {
                msg: prompt('사유 입력')
            },
            callback(data) {
                loadEmoticons();
                setSelectId(0);
            }
        });
    }

    return (
        <Modal
            id='emoticon_manage_box'
            title='이모티콘 관리'
            callback={() => {
                setSelectMenuIdx(0);
                if (selectMenuIdx === -1) return;
                loadEmoticons();
            }}
            menuList={menuList}
            selectMenuCallback={idx => {
                setSelectId(0);
                setSelectMenuIdx(idx);
            }}
        >
            <ul className={`${styles.emoticon_list} scroll-bar horizontal`}>{
                emoticonList.map(emoticon => (
                    <li key={emoticon.id} onClick={() => setSelectId(emoticon.id)}>
                        <Image
                            src={`https://test.bssm.kro.kr/resource/board/emoticon/${emoticon.id}/0.png`}
                            width='100px'
                            height='50px'
                            alt={emoticon.name}
                        />
                    </li>
                ))
            }</ul>
            <div className='cols gap-1'>
                <ul className={`${styles.emoticon_item_list} scroll-bar`}>{
                    emoticonList
                    .filter(emoticon => emoticon.id === selectId)
                    ?.[0]?.items.map(item => (
                        <li key={`${item.id}/${item.idx}`}>
                            <img
                                src={`https://test.bssm.kro.kr/resource/board/emoticon/${item.id}/${item.idx}.${item.type}`}
                                alt={String(item.idx)}
                            />
                        </li>
                    ))
                }</ul>
                {selectId !== 0 &&(
                    selectMenuIdx === 0
                    ? <button className='button delete main' onClick={deleteEmoticon}>삭제</button>
                    : <div className='rows gap-05'>
                        <button className='button delete flex-main' onClick={deleteEmoticon}>반려</button>
                        <button className='button accent flex-main' onClick={activeEmoticon}>승인</button>
                    </div>
                )}
            </div>
        </Modal>
    );
}