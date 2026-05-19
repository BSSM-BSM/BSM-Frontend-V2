import { getDefaultStore } from "jotai";
import { pageState } from "@/store/common.store";

interface Page {
  id: string,
  subId?: string
};

export const activePageCheck = ({id, subId}: Page, strict?: boolean) => {
  if (typeof window === 'undefined') return false;
  const {id: currentId, subId: currentSubId} = getDefaultStore().get(pageState);

  if (!strict && !subId) return currentId === id;
  return currentId === id && currentSubId === subId;
}