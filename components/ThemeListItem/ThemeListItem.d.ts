import { IUpdater } from "@core/lib/useUpdater";

export declare interface IThemeListItemProps extends IUpdater<ITheme> {
    upload: (file: File) => Promise<void>;
    remove: () => Promise<void>;
    exportTheme: () => void;
}

// What gets passed into the component from the parent as attributes
export declare interface IThemeListItemInputProps {
    classes?: any;
    theme: ITheme;
    refresh: () => void;
    defaultThemeId: string | null;
    setDefaultTheme: (id: string) => () => void;
}

export type ThemeListItemProps = IThemeListItemInputProps & IThemeListItemProps;