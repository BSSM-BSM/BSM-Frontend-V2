import { Button } from '@/components/common/buttons/button';
import { TextInput } from '@/components/common/inputs/textInput';
import Modal from '@/components/common/modal';
import { useModal } from '@/hooks/useModal';
import { backgroundImageUrlState } from '@/store/common.store';
import { useRecoilState } from 'recoil';

export const EditBackgroundImageBox = () => {
  const { closeModal } = useModal();
  const [backgroundImageUrl, setBackgroundImageUrl] = useRecoilState(backgroundImageUrlState);

  return (
    <Modal type="main" id="edit-background-image" title="배경 이미지 변경">
      <form
        className="cols gap-1"
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          closeModal('edit-background-image');
        }}
      >
        <TextInput
          value={backgroundImageUrl}
          setCallback={setBackgroundImageUrl}
          placeholder="배경으로 사용할 이미지 URL"
          required
          full
        />
        <div className="rows gap-1">
          <Button
            className="delete"
            full
            onClick={e => {
              setBackgroundImageUrl('');
              closeModal('edit-background-image');
              e.preventDefault();
            }}
          >
            초기화
          </Button>
          <Button type="submit" className="accent" full>
            이미지 변경
          </Button>
        </div>
      </form>
    </Modal>
  );
};
