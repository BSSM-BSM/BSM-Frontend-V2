import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { loadingState } from "@/store/overlay.store";

const Loading = () => {
  const [mounted, setMounted] = useState(false);
  const [loading] = useRecoilState(loadingState);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(
    loading && (
      <div className='loading'>
        <div>
          <span></span>
        </div>
      </div>
    ),
    document.querySelector('#overlay-wrap') as HTMLElement
  ) : null;
};

export default Loading;