import { Dispatch, SetStateAction } from 'react';
import styles from '../../styles/board/board.module.css';
import { Category } from '../../types/boardType';

interface CategoryListProps {
    postCategory: string,
    setPostCategory: Dispatch<SetStateAction<string>>,
    categoryList: Category[]
}

export const CategoryList = ({
    postCategory,
    setPostCategory,
    categoryList
}: CategoryListProps) => (
    <ul className={`${styles.category_list} rows gap-05 scroll-bar no-overlay`}>{
        categoryList.map(category => (
            <li
                key={category.id}
                onClick={() => setPostCategory(category.id)}
                className={postCategory === category.id? styles.active: ''}
            >
                {category.name}
            </li>
        ))
    }</ul>
)