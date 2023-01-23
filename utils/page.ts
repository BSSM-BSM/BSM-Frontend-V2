import { getRecoil } from "recoil-nexus";
import { pageState } from "../store/common.store";

export const activePageCheck = ({
  id,
  subId
}: {
  id: string,
  subId?: string
}) => {
  if (typeof window === 'undefined') return false;
  const {id: currentId, subId: currentSubId} = getRecoil(pageState);

  if (!subId) return currentId === id;
  return currentSubId === subId;
}
