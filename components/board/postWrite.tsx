import styles from '../../styles/board/post.module.css';
import { Dispatch, SetStateAction, useState } from "react";
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { Editor } from '@tinymce/tinymce-react';
import { TextInput } from "../common/inputs/textInput";
import { CategoryList } from "./categoryList";
import { Category } from "../../types/boardType";
import { useRouter } from 'next/router';

interface PostWriteProps {
    boardId: string,
    categoryList: {
        [index: string]: Category
    },
    setPostWriteOpen: Dispatch<SetStateAction<boolean>>
}

export const PostWrite = ({
    boardId,
    categoryList,
    setPostWriteOpen
}: PostWriteProps) => {
    const {ajax} = useAjax();
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [category, setCategory] = useState<string>('normal');

    const writePost = () => {
        ajax<number>({
            url: `post/${boardId}`,
            method: HttpMethod.POST,
            payload: {
                title,
                content,
                category,
                anonymous: false
            },
            callback(postId) {
                setPostWriteOpen(false);
                router.push(`/board/${boardId}/${postId}`);
            },
        })
    }

    return (
        <div className={`container _100 ${styles.post_write_wrap}`}>
            <TextInput
                setCallback={setTitle}
                placeholder='제목'
                required
                full
            />
            <Editor
                tinymceScriptSrc='/lib/tinymce/tinymce.min.js'
                init={{
                    language: 'ko_KR',
                    height: 480,
                    menubar: true,
                    mobile: {
                        menubar: true,
                    },
                    skin: localStorage.getItem('theme')=='dark'? 'oxide-dark': undefined,
                    content_css: localStorage.getItem('theme')?? undefined,
                    plugins: [
                        'code','autolink','lists','link','image','charmap','preview','anchor','searchreplace','visualblocks','media','table','wordcount','codesample'
                    ],
                    toolbar: 'undo redo codesample | bold italic | alignleft alignright aligncenter alignjustify | emoticon image media | preview code',
                    codesample_global_prismjs: true,
                    relative_urls: false,
                    convert_urls: false,
                    extended_valid_elements: 'img[src|class|alt|e_id|e_idx|e_type]',
                }}
                value={content}
                onEditorChange={((content, editor) => {
                    console.log(content)
                    setContent(content);
                })}
            />
            <div className="rows">
                <CategoryList
                    className='flex-main'
                    postCategory={category}
                    setPostCategory={setCategory}
                    categoryList={
                        [
                            {id: 'normal', name: '일반'},
                            ...Object.values(categoryList)
                        ]
                    }
                />
                <button className='button accent' onClick={writePost}>글 작성</button>
            </div>
        </div>
    );
}