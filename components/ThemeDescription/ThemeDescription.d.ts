import { ILayoutComponent } from "@theming/lib/layout/componentRegistry";

export declare interface IThemeDescriptionProps {
    description: string;
}

// What gets passed into the component from the parent as attributes
export declare interface IThemeDescriptionInputProps {
    className?: string;
    css?: string;
    classes?: any;
    slots?: Index<ILayoutComponent[]>;
    __layoutId?: string;
}

export type ThemeDescriptionProps = IThemeDescriptionInputProps & IThemeDescriptionProps;
