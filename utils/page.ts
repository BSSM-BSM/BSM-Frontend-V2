import { getRecoil } from "recoil-nexus";
import { pageState } from "../store/common.store";

export const activePageCheck = ({
  id,
  subId
}: {
  id: string,
  subId?: string
}) => {
  const {id: currentId, subId: currentSubId} = getRecoil(pageState);

  console.log(1, currentId === id)
  if (!subId) return currentId === id;
  console.log(2, currentId === id)
  return currentSubId === subId;
}
