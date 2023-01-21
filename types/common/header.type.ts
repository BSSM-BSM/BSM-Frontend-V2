import { DropdownMenuOption } from "./dropdown.type";

export interface HeaderOptionState {
  title: string,
  allMenu?: {
      goBack?: boolean;
      dropdownMenu?: DropdownMenuOption[];
  },
  optionMenu?: {
      dropdownMenu?: DropdownMenuOption[];
  }
}
