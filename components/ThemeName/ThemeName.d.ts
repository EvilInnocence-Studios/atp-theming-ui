import { ILayoutComponent } from "@theming/lib/layout/componentRegistry";

export declare interface IThemeNameProps {
    name: string;
}

// What gets passed into the component from the parent as attributes
export declare interface IThemeNameInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type ThemeNameProps = IThemeNameInputProps & IThemeNameProps;
