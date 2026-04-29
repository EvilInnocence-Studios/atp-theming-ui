import { IModal } from "@core/lib/useModal";
import { ITheme } from "@theming-shared/theme/types";
import { ILayoutOption } from "@theming/lib/layout/componentRegistry";

export declare interface ILayoutOptionDetails extends ILayoutOption {
    complete: boolean;
}

export declare interface ILayoutElementSelectProps {
    modal: IModal;
    options: Index<Index<ILayoutOptionDetails[]>>
    currentOption: ILayoutOption | undefined;
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutElementSelectInputProps {
    classes?: any;
    theme: ITheme | null;
    selectedElement: string | null;
    onSelect: (element: string) => void;
}

export type LayoutElementSelectProps = ILayoutElementSelectInputProps & ILayoutElementSelectProps;