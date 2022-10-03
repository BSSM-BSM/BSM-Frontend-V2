import styles from '../../styles/board/emoticon.module.css';
import { useEffect, useState } from "react"
import { HttpMethod, useAjax } from "../../hooks/useAjax"
import { Emoticon } from "../../types/boardType"
import Modal from "../common/modal"
import Image from 'next/image';

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