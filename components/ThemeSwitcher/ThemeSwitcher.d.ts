import { ILayoutComponent } from "@theming/components/LayoutManager/LayoutManager.d";
import { Index } from "ts-functional/dist/types";
import { ITheme } from "@common-shared/theme/types";

export declare interface IThemeSwitcherProps {
    themes: ITheme[];
    currentThemeId: string;
    onChange: (themeId: string) => void;
}

// What gets passed into the component from the parent as attributes
export declare interface IThemeSwitcherInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type ThemeSwitcherProps = IThemeSwitcherInputProps & IThemeSwitcherProps;
