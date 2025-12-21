import { ITheme } from "@common-shared/theme/types";
import { ILayoutComponent } from "@core/lib/layout/layout";
import { IUpdater } from "@core/lib/useUpdater";
import { IToggle } from "@core/lib/useToggle";

export declare interface ILayoutManagerProps {
    layout: ILayoutComponent | null;
    isEditing: IToggle | null;
    selectedId: string | null;
    selectComponent: (id: string | null) => void;
    addComponent: (parentId: string, slotName: string, component: ILayoutComponent, index?: number) => void;
    removeComponent: (id: string) => void;
    updateComponent: (id: string, updates: Partial<ILayoutComponent>) => void;
    UpdateButtons: () => JSX.Element | null;
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutManagerInputProps {
    classes?: any;
    themeId: string;
}

export type LayoutManagerProps = ILayoutManagerInputProps & ILayoutManagerProps;