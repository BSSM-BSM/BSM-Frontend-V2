'use client';

import styles from '@/styles/board/post/post.module.css';
import { useEffect, useState } from 'react';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinymceEditor } from 'tinymce';
import { TextInput } from '@/components/common/inputs/textInput';
import { Category, DetailPost } from '@/types/board.type';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { boardActiveEditorState, postIdState } from '@/store/board.store';
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/common/buttons/button';
import { CheckList } from '@/components/common/buttons/checkList';
import { boardAnonymousModeState } from '@/store/setting/board.store';
import { themeState } from '@/store/common.store';

interface UploadFileRes {
  id: string;
  fileExt: string;
}

const Write = () => {
  const { ajax } = useAjax();
  const theme = useRecoilValue(themeState);
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [mainImgSrc, setMainImgSrc] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [editor, setEditor] = useState<TinymceEditor>();
  const { openModal } = useModal();

  const writeLostfound = async () => {
    const [data, error] = await ajax<any>({
      url: '/api/lost-found/def',
      method: HttpMethod.POST,
      payload: {
        objectName: title,
        imgSrc: mainImgSrc,
        location,
        findDateTime: new Date(),
        description
      }
    });
    if (error) return;

    router.push(`/board/lostfound/${data.id}`);
  };

  const imagesUploadHandler = async (blobInfo: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      let file = new FormData();
      file.append('file', blobInfo.blob());

      const [data, error] = await ajax<UploadFileRes>({
        method: HttpMethod.POST,
        payload: file,
        url: '/post/file',
        config: {
          timeout: 0
        },
        errorCallback: data => {
          if (!data) return reject({ message: '알 수 없는 에러가 발생하였습니다', remove: true });
          reject({ message: data.message, remove: true });
        }
      });
      if (error) return;
      resolve(`/resource/board/upload/${data.id}.${data.fileExt}`);
    });
  };

  return (
    <div className={`container _110 ${styles.post_write}`}>
      <TextInput setCallback={setTitle} value={title} placeholder="제목" required full />
      <Editor
        tinymceScriptSrc={process.env.NODE_ENV === 'development' ? undefined : '/lib/tinymce/tinymce.min.js'}
        onInit={(_, editor) => setEditor(editor)}
        init={{
          language: 'ko_KR',
          height: '100vh',
          menubar: true,
          mobile: {
            menubar: true
          },
          skin: theme === 'dark' ? 'oxide-dark' : undefined,
          content_css: theme ?? undefined,
          plugins: [
            'code',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'media',
            'table',
            'wordcount',
            'codesample'
          ],
          toolbar:
            'undo redo codesample | bold italic | alignleft alignright aligncenter alignjustify | emoticon image media | preview code',
          codesample_global_prismjs: true,
          setup: tinymceEditor => {
            tinymceEditor.ui.registry.addButton('emoticon', {
              text: '이모티콘',
              onAction: () => {
                openModal('emoticon');
              }
            });
          },
          relative_urls: false,
          convert_urls: false,
          extended_valid_elements: 'img[src|class|alt|e_id|e_idx|e_type]',
          images_upload_handler: imagesUploadHandler,
          init_instance_callback: editor => {
            const css = document.createElement('style');
            css.innerHTML =
              'html{font-size:16px}ul,ol,li{list-style:none}a{text-decoration:none}.emoticon{width:100px!important;height:100px!important}body{padding:15px!important;line-height: 1.2;font-family: NotoSans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;}a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, button, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, input, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, textarea, tfoot, th, thead, time, tr, tt, u, ul, var, video{margin: 0;padding: 0;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;border-collapse: collapse;line-height: inherit;vertical-align: middle;}';
            editor.contentDocument.head.appendChild(css);
          }
        }}
        value={description}
        onEditorChange={description => setDescription(description)}
      />
      <div>
        <span>메인 이미지 링크</span>
        <input type="text" onChange={e => setMainImgSrc(e.target.value)} value={mainImgSrc} />
      </div>
      <div>
        <span>보관중인장소</span>
        <input type="text" onChange={e => setLocation(e.target.value)} value={location} />
      </div>
      <div className="rows gap-1">
        <Button className="accent" onClick={writeLostfound}>
          글 작성
        </Button>
      </div>
    </div>
  );
};

export default Write;
