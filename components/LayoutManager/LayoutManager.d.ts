import { ITheme } from "@theming-shared/theme/types";
import { ILayoutComponent } from "@core/lib/layout/layout";
import { IUpdater } from "@core/lib/useUpdater";

export declare interface ILayoutManagerProps {
    theme: ITheme | null;
    updater: IUpdater<ITheme> | null;
    element: string | null;
    setElement: (element: string) => void;
    layout: ILayoutComponent | null;
    onChange: (layout: ILayoutComponent | null) => void;
    onImportLayouts: (importedLayouts: Record<string, ILayoutComponent>) => void;
    UpdateButtons: IUpdater<ITheme>["UpdateButtons"];
}

// What gets passed into the component from the parent as attributes
export declare interface ILayoutManagerInputProps {
    classes?: Record<string, string>;
    themeId: string;
}

export type LayoutManagerProps = ILayoutManagerInputProps & ILayoutManagerProps;