export const renderEmoticon = () => {
  document.querySelectorAll<HTMLImageElement>('img[e_id]:not(.emoticon)').forEach(el => {
    el.src = `/resource/board/emoticon/${el.getAttribute('e_id')}/${el.getAttribute('e_idx')}.${el.getAttribute('e_type')}`;
    el.classList.add('emoticon');
  });
}