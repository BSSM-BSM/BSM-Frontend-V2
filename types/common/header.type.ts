import { DropdownMenuOption } from "@/types/common/dropdown.type";

export interface HeaderOptionState {
  title?: string,
  headTitle?: string,
  optionMenu?: {
      dropdownMenu?: DropdownMenuOption[];
  }
}
