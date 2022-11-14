import styles from '../../../styles/common/check-list.module.css';

interface CheckListProps<ID, T extends Menu<ID>> {
    currentItem: ID,
    itemList: T[],
    callback: (item: T) => void,
    className?: string
}

interface Menu<ID> {
    name: string,
    id: ID
}

export const CheckList = <ID, T extends Menu<ID>>({
    currentItem,
    itemList,
    callback,
    className
}: CheckListProps<ID, T>) => (
    <ul className={`${styles.check_list} button-wrap scroll-bar no-overlay horizontal ${className ?? ''}`}>{
        itemList.map(item => (
            <li
                key={`${item.id}-${item.name}`}
                onClick={() => callback(item)}
                className={item.id === currentItem? styles.active: ''}
            >
                {item.name}
            </li>
        ))
    }</ul>
);