import styles from '../../styles/board/emoticon.module.css';
import { ChangeEvent, useEffect, useState } from "react"
import { HttpMethod, useAjax } from "../../hooks/useAjax"
import { Emoticon, EmoticonItem } from "../../types/boardType"
import Modal from "../common/modal"
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { boardActiveEditorState } from '../../store/board.store';
import { TextInput } from '../common/inputs/textInput';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';

export const EmoticonBoxWrap = () => (
    <>
        <EmoticonBox />
        <EmoticonManageBox />
        <EmoticonUploadBox />
    </>
);

const EmoticonBox = () => {
    const {ajax} = useAjax();
    const {openModal, closeModal} = useModal();
    const [emoticonList, setEmoticonList] = useState<Emoticon[]>([]);
    const [selectId, setSelectId] = useState<number>(0);
    const [activeEditor] = useRecoilState(boardActiveEditorState);

    const loadEmoticons = () => {
        ajax<Emoticon[]>({
            url: 'emoticon',
            method: HttpMethod.GET,
            callback(data) {
                setEmoticonList(data);
            }
        });
    }

    const insertEmoticon = (item: EmoticonItem) => {
        if (activeEditor && 'insertContent' in activeEditor) {
            activeEditor.insertContent(`<img src="/resource/board/emoticon/${item.id}/${item.idx}.${item.type}" e_id="${item.id}" e_idx="${item.idx}" e_type="${item.type}" class="emoticon">`);
            return;
        }
        if (!activeEditor?.current) return;

        activeEditor.current.focus();
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const emoticon = document.createElement('img');
        emoticon.src = `/resource/board/emoticon/${item.id}/${item.idx}.${item.type}`;
        emoticon.setAttribute('e_id', `${item.id}`);
        emoticon.setAttribute('e_idx', `${item.idx}`);
        emoticon.setAttribute('e_type', `${item.type}`);
        emoticon.classList.add('emoticon');
        range?.insertNode(emoticon);
        range?.setStartAfter(emoticon);
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
                    <li key={`${item.id}/${item.idx}`} onClick={() => insertEmoticon(item)}>
                        <img
                            src={`https://test.bssm.kro.kr/resource/board/emoticon/${item.id}/${item.idx}.${item.type}`}
                            alt={String(item.idx)}
                        />
                    </li>
                ))
            }</ul>
            <p onClick={() => {
                openModal('emoticon_upload');
                closeModal('emoticon');
            }}>
                이모티콘을 업로드 하고싶나요? 여기를 누르세요
            </p>
        </Modal>
    );
}

const EmoticonManageBox = () => {
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

const EmoticonUploadBox = () => {
    const {ajax} = useAjax();
    const {closeModal} = useModal();
    const {showToast} = useOverlay();
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [emoticonList, setEmoticonList] = useState<(File | null)[]>(Array.from({length: 4}, _ => null));
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const thumbnailInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setThumbnail(e.target.files?.[0]);
    }

    const fileInputHandler = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        const file = e.target.files?.[0]
        if (!file) return;
        setEmoticonList(prev => [
            ...prev.slice(0, i),
            file,
            ...prev.slice(i + 1)
        ]);
    }

    const emoticonDeleteHandler = (i: number) => {
        setEmoticonList(prev => [
            ...prev.slice(0, i),
            ...prev.slice(i + 1)
        ]);
    }

    const uploadEmoticon = () => {
        if (!thumbnail) return showToast('이모티콘 썸네일이 없습니다');

        const payload = new FormData();
        payload.append('name', name);
        payload.append('description', description);
        payload.append('thumbnail', thumbnail);
        
        emoticonList.forEach(emoticon => {
            if (!emoticon) throw showToast('이모티콘을 모두 업로드 해주세요');
            payload.append('emoticonList', emoticon);
        })
        ajax({
            url: 'emoticon',
            method: HttpMethod.POST,
            payload,
            callback() {
                showToast('이모티콘 업로드에 성공하였습니다\n관리자의 승인후 사용가능합니다', 10000);
                closeModal('emoticon_upload');
                setName('');
                setDescription('');
                setThumbnail(null);
                setEmoticonList(Array.from({length: 4}, _ => null));
            }
        });
    }

    return (
        <Modal id='emoticon_upload' title='이모티콘 업로드'>
            <form
                className='cols gap-1'
                autoComplete='off'
                onSubmit={e => {
                    e.preventDefault();
                    uploadEmoticon();
                }}
            >
                <div className={styles.upload_thumbnail}>
                    <label htmlFor='emoticon_upload_thumbnail'>{
                        thumbnail
                        ? <img
                            src={URL.createObjectURL(thumbnail)}
                            alt='thumbnail'
                        />
                        : '썸네일'
                    }</label>
                    <input
                        type='file'
                        id='emoticon_upload_thumbnail'
                        onChange={thumbnailInputHandler}
                        style={{display: 'none'}}
                        accept='.png'
                    />
                    <TextInput
                        setCallback={setName}
                        placeholder='이모티콘 이름'
                        className='flex-main'
                        minLength={2}
                        maxLength={12}
                        required
                        full
                    />
                </div>
                <TextInput
                    setCallback={setDescription}
                    placeholder='이모티콘 설명'
                    minLength={2}
                    maxLength={100}
                    required
                    full
                />
                <ul className={`${styles.emoticon_item_list} ${styles.upload_list} scroll-bar`}>
                    {emoticonList.map((item, i) => (
                        deleteMode
                        ? <li
                            key={`upload/${i}`}
                            className='button delete'
                            onClick={() => {
                                if (emoticonList.length <= 4) return showToast('이모티콘 최소 개수는 4개입니다');
                                emoticonDeleteHandler(i);
                            }}>
                            <label>{i+1}번 삭제</label>
                        </li>
                        : <li key={`upload/${i}`} className='button'>
                            <label htmlFor={`emoticon_upload_${i}`}>{
                                item
                                ? <img
                                    src={URL.createObjectURL(item)}
                                    alt={String(i)}
                                />
                                : `${i+1}번 업로드`
                            }</label>
                            <input
                                type='file'
                                id={`emoticon_upload_${i}`}
                                onChange={(e) => {
                                    fileInputHandler(e, i);
                                }}
                                style={{display: 'none'}}
                                accept='.png, .jpg, .jpeg, .gif, .webp'
                            />
                        </li>
                    ))}
                    <li key='add' className='button' onClick={() => {
                        if (emoticonList.length >= 100) return showToast('이모티콘 최대 개수는 100개입니다');
                        setEmoticonList(prev => [...prev, null]);
                    }}>
                        <label>추가</label>
                    </li>
                    <li key='mode' className='button' onClick={() => setDeleteMode(prev => !prev)}>
                        <label>{deleteMode? 'Delete': 'Upload'} Mode</label>
                    </li>
                </ul>
                <p>썸네일: 2:1비율의 png파일</p>
                <p>이모티콘: 1:1비율의 png, jpg, gif, webp파일</p>
                <button className='button main accent'>업로드</button>
            </form>
        </Modal>
    );
}