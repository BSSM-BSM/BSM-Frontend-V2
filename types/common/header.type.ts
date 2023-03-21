import { DropdownMenuOption } from "./dropdown.type";

export interface HeaderOptionState {
  title?: string,
  headTitle?: string,
  optionMenu?: {
      dropdownMenu?: DropdownMenuOption[];
  }
}
