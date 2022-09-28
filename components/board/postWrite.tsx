import styles from '../../styles/board/post.module.css';
import { useEffect, useState } from "react";
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { Editor } from '@tinymce/tinymce-react';
import { TextInput } from "../common/inputs/textInput";
import { CategoryList } from "./categoryList";
import { Category, DetailPost } from "../../types/boardType";
import { useRouter } from 'next/router';

interface PostWriteProps {
    boardId: string,
    categoryList: {
        [index: string]: Category
    },
    editPost: DetailPost | null,
    setPost: Function
}

interface UploadFileRes {
    id: string,
    fileExt: string
}

export const PostWrite = ({
    boardId,
    categoryList,
    editPost,
    setPost
}: PostWriteProps) => {
    const {ajax} = useAjax();
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [category, setCategory] = useState<string>('normal');

    useEffect(() => {
        if (editPost) {
            setTitle(editPost.title)
            setContent(editPost.content);
            setCategory(editPost.category ?? 'normal');
        } else {
            setTitle('');
            setContent('');
            setCategory('normal');
        }
    }, [editPost]);

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
                router.push(`/board/${boardId}/${postId}`);
            },
        });
    }

    const modifyPost = () => {
        ajax({
            url: `post/${boardId}/${editPost?.id}`,
            method: HttpMethod.PUT,
            payload: {
                title,
                content,
                category,
                anonymous: false
            },
            callback() {
                setPost(null);
                router.push(`/board/${boardId}/${editPost?.id ?? ''}`);
            },
        });
    }

    return (
        <div className={`container _110 ${styles.post_write_wrap}`}>
            <TextInput
                setCallback={setTitle}
                value={title}
                placeholder='제목'
                required
                full
            />
            <Editor
                tinymceScriptSrc='/lib/tinymce/tinymce.min.js'
                init={{
                    language: 'ko_KR',
                    height: '100%',
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
                    images_upload_handler: (blobInfo) => {
                        return new Promise((resolve, reject) => {
                            let file = new FormData();
                            file.append('file', blobInfo.blob());
                            ajax<UploadFileRes>({
                                method: HttpMethod.POST,
                                payload: file,
                                url: '/post/upload',
                                config:{
                                    timeout: 0
                                },
                                callback:(data) => resolve(`/resource/board/upload/${data.id}.${data.fileExt}`),
                                errorCallback:(data) => {
                                    if (!data) return reject({message: '알 수 없는 에러가 발생하였습니다', remove: true});
                                    reject({message: data.message, remove: true});
                                }
                            });
                        });
                    }
                }}
                value={content}
                onEditorChange={content => setContent(content)}
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
                {
                    editPost
                    ? <button className='button accent' onClick={modifyPost}>글 수정</button>
                    : <button className='button accent' onClick={writePost}>글 작성</button>
                }
            </div>
        </div>
    );
}