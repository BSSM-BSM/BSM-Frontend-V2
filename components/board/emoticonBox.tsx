import styles from '@/styles/board/emoticon.module.css';
import { ChangeEvent, useEffect, useState } from "react"
import { HttpMethod, useAjax } from "@/hooks/useAjax"
import { Emoticon, EmoticonItem } from "@/types/board.type"
import Modal from "@/components/common/modal"
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { boardActiveEditorState } from '@/store/board.store';
import { TextInput } from '@/components/common/inputs/textInput';
import { useModal } from '@/hooks/useModal';
import { useOverlay } from '@/hooks/useOverlay';
import { Button } from '@/components/common/buttons/button';

export const EmoticonBoxWrap = () => (
  <>
    <EmoticonBox />
    <EmoticonManageBox />
    <EmoticonUploadBox />
  </>
);

const EmoticonBox = () => {
  const { ajax } = useAjax();
  const { openModal, closeModal } = useModal();
  const [emoticons, setEmoticons] = useState<Emoticon[]>([]);
  const [emoticonItems, setEmoticonItems] = useState<EmoticonItem[]>([]);
  const [selectId, setSelectId] = useState<number>(0);
  const [activeEditor] = useRecoilState(boardActiveEditorState);

  const loadEmoticons = async () => {
    const [data, error] = await ajax<Emoticon[]>({
      url: 'emoticon',
      method: HttpMethod.GET
    });
    if (error) return;
    setEmoticons(data);
  }

  const loadEmoticonItems = async () => {
    const [data, error] = await ajax<EmoticonItem[]>({
      url: `emoticon/${selectId}`,
      method: HttpMethod.GET
    });
    if (error) return;
    setEmoticonItems(data);
  }

  useEffect(() => {
    if (selectId < 1) {
      return;
    }
    loadEmoticonItems();
  }, [selectId]);

  const insertEmoticon = (id: number, item: EmoticonItem) => {
    if (activeEditor && 'insertContent' in activeEditor) {
      activeEditor.insertContent(`<img src="/resource/board/emoticon/${id}/${item.idx}.${item.type}" e_id="${id}" e_idx="${item.idx}" e_type="${item.type}" class="emoticon">`);
      return;
    }
    if (!activeEditor?.current) return;

    activeEditor.current.focus();
    const selection = window.getSelection();
    selection?.deleteFromDocument();

    const range = selection?.getRangeAt(0);
    const emoticon = document.createElement('img');
    emoticon.src = `/resource/board/emoticon/${id}/${item.idx}.${item.type}`;
    emoticon.setAttribute('e_id', `${id}`);
    emoticon.setAttribute('e_idx', `${item.idx}`);
    emoticon.setAttribute('e_type', `${item.type}`);
    emoticon.classList.add('emoticon');
    range?.insertNode(emoticon);
    range?.setStartAfter(emoticon);
  }

  return (
    <Modal id='emoticon' title='이모티콘 넣기' onOpen={loadEmoticons}>
      <ul className={`${styles.emoticon_list} scroll-bar horizontal`}>
        <li key='upload' className={styles.upload_emoticon} onClick={() => {
          openModal('emoticon_upload');
          closeModal('emoticon');
        }}>
          +
        </li>
        {emoticons.map(emoticon => (
          <li key={emoticon.id} onClick={() => setSelectId(emoticon.id)}>
            <Image
              src={`https://bssm.kro.kr/resource/board/emoticon/${emoticon.id}/0.png`}
              width='100'
              height='50'
              alt={emoticon.name}
            />
          </li>
        ))}
      </ul>
      <ul className={`${styles.emoticon_item_list} scroll-bar`}>{
        emoticonItems.map(item => (
          <li key={`${selectId}/${item.idx}`} onClick={() => insertEmoticon(selectId, item)}>
            <img
              src={`https://bssm.kro.kr/resource/board/emoticon/${selectId}/${item.idx}.${item.type}`}
              alt={String(item.idx)}
            />
          </li>
        ))
      }</ul>
    </Modal>
  );
}

const EmoticonManageBox = () => {
  const { ajax } = useAjax();
  const [emoticons, setEmoticons] = useState<Emoticon[]>([]);
  const [emoticonItems, setEmoticonItems] = useState<EmoticonItem[]>([]);
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

  const loadEmoticons = async () => {
    const url = (() => {
      switch (selectMenuIdx) {
        case 0: return 'emoticon';
        case 1: return 'admin/emoticon/inactive';
        default: return '';
      }
    })();
    const [data, error] = await ajax<Emoticon[]>({
      url,
      method: HttpMethod.GET
    });
    if (error) return;

    setEmoticons(data);
  }


  const loadEmoticonItems = async () => {
    const [data, error] = await ajax<EmoticonItem[]>({
      url: `emoticon/${selectId}`,
      method: HttpMethod.GET
    });
    if (error) return;
    setEmoticonItems(data);
  }

  useEffect(() => {
    if (selectId < 1) {
      return;
    }
    loadEmoticonItems();
  }, [selectId]);

  useEffect(() => {
    if (selectMenuIdx === -1) return;
    loadEmoticons();
  }, [selectMenuIdx]);

  const activeEmoticon = async () => {
    if (!confirm('정말 이모티콘을 활성화하시겠습니까?')) return;
    const [, error] = await ajax({
      url: `admin/emoticon/${selectId}`,
      method: HttpMethod.PUT,
    });
    if (error) return;
    loadEmoticons();
    setSelectId(0);
  }

  const deleteEmoticon = async () => {
    if (!confirm('정말 이모티콘을 삭제하시겠습니까?')) return;
    const [, error] = await ajax({
      url: `admin/emoticon/${selectId}/delete`,
      method: HttpMethod.PUT,
      payload: {
        msg: prompt('사유 입력')
      }
    });
    if (error) return;

    loadEmoticons();
    setSelectId(0);
  }

  return (
    <Modal
      id='emoticon_manage_box'
      title='이모티콘 관리'
      onOpen={() => {
        setSelectMenuIdx(0);
        if (selectMenuIdx === -1) return;
        loadEmoticons();
      }}
      menuList={menuList}
      onSelectMenu={idx => {
        setSelectId(0);
        setSelectMenuIdx(idx);
      }}
    >
      <ul className={`${styles.emoticon_list} scroll-bar horizontal`}>{
        emoticons.map(emoticon => (
          <li key={emoticon.id} onClick={() => setSelectId(emoticon.id)}>
            <Image
              src={`https://bssm.kro.kr/resource/board/emoticon/${emoticon.id}/0.png`}
              width='100'
              height='50'
              alt={emoticon.name}
            />
          </li>
        ))
      }</ul>
      <div className='cols gap-1'>
        <ul className={`${styles.emoticon_item_list} scroll-bar`}>{
          emoticonItems.map(item => (
            <li key={`${selectId}/${item.idx}`}>
              <img
                src={`https://bssm.kro.kr/resource/board/emoticon/${selectId}/${item.idx}.${item.type}`}
                alt={String(item.idx)}
              />
            </li>
          ))
        }</ul>
        {selectId !== 0 && (
          selectMenuIdx === 0
            ? <Button full className='delete' onClick={deleteEmoticon}>삭제</Button>
            : <div className='rows gap-05'>
              <Button className='delete flex-main' onClick={deleteEmoticon}>반려</Button>
              <Button className='accent flex-main' onClick={activeEmoticon}>승인</Button>
            </div>
        )}
      </div>
    </Modal>
  );
}

const EmoticonUploadBox = () => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const { showToast } = useOverlay();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [emoticons, setEmoticons] = useState<(File | null)[]>(Array.from({ length: 4 }, _ => null));
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  const thumbnailInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setThumbnail(e.target.files?.[0]);
  }

  const fileInputHandler = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files?.[0]
    if (!file) return;
    setEmoticons(prev => [
      ...prev.slice(0, i),
      file,
      ...prev.slice(i + 1)
    ]);
  }

  const emoticonDeleteHandler = (i: number) => {
    setEmoticons(prev => [
      ...prev.slice(0, i),
      ...prev.slice(i + 1)
    ]);
  }

  const uploadEmoticon = async () => {
    if (!thumbnail) return showToast('이모티콘 썸네일이 없습니다');

    const payload = new FormData();
    payload.append('name', name);
    payload.append('description', description);
    payload.append('thumbnail', thumbnail);

    emoticons.forEach(emoticon => {
      if (!emoticon) throw showToast('이모티콘을 모두 업로드 해주세요');
      payload.append('emoticons', emoticon);
    })
    const [, error] = await ajax({
      url: 'emoticon',
      method: HttpMethod.POST,
      payload,
    });
    if (error) return;

    showToast('이모티콘 업로드에 성공하였습니다\n관리자의 승인 후 사용가능합니다', 10000);
    closeModal('emoticon_upload');
    setName('');
    setDescription('');
    setThumbnail(null);
    setEmoticons(Array.from({ length: 4 }, _ => null));
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
            style={{ display: 'none' }}
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
        <ul className={`${styles.emoticon_item_list} ${styles.upload_list} scroll-bar button-wrap`}>
          {emoticons.map((item, i) => (
            deleteMode
              ? <li
                key={`upload/${i}`}
                className={styles.delete}
                onClick={() => {
                  if (emoticons.length <= 4) return showToast('이모티콘 최소 개수는 4개입니다');
                  emoticonDeleteHandler(i);
                }}>
                <label>{i + 1}번 삭제</label>
              </li>
              : <li key={`upload/${i}`}>
                <label htmlFor={`emoticon_upload_${i}`}>{
                  item
                    ? <img
                      src={URL.createObjectURL(item)}
                      alt={String(i)}
                    />
                    : `${i + 1}번 업로드`
                }</label>
                <input
                  type='file'
                  id={`emoticon_upload_${i}`}
                  onChange={(e) => {
                    fileInputHandler(e, i);
                  }}
                  style={{ display: 'none' }}
                  accept='.png, .jpg, .jpeg, .gif, .webp'
                />
              </li>
          ))}
          <li key='add' onClick={() => {
            if (emoticons.length >= 100) return showToast('이모티콘 최대 개수는 100개입니다');
            setEmoticons(prev => [...prev, null]);
          }}>
            <label>추가</label>
          </li>
          <li key='mode' onClick={() => setDeleteMode(prev => !prev)}>
            <label>{deleteMode ? 'Delete' : 'Upload'} Mode</label>
          </li>
        </ul>
        <p>썸네일: 2:1비율의 png파일</p>
        <p>이모티콘: 1:1비율의 png, jpg, gif, webp파일</p>
        <Button type='submit' className='main accent'>업로드</Button>
      </form>
    </Modal>
  );
}