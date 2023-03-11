import { DropdownMenuOption } from "./dropdown.type";

export interface HeaderOptionState {
  title: string,
  optionMenu?: {
      dropdownMenu?: DropdownMenuOption[];
  }
}
