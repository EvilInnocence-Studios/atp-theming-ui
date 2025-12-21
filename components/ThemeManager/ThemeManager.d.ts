export declare interface IThemeManagerProps {
    create: () => void;
    themes: ITheme[];
    isLoading: boolean;
    refresh: () => void;
    defaultThemeId: string | null;
    setDefaultTheme: (id: string) => () => void;
}

// What gets passed into the component from the parent as attributes
export declare interface IThemeManagerInputProps {
    classes?: any;
}

export type ThemeManagerProps = IThemeManagerInputProps & IThemeManagerProps;